-- DROP DATABASE
--     IF EXISTS "instarecibo_db";
-- CREATE DATABASE
--     "instarecibo_db";
set
    timezone to 'America/Santo_Domingo';

-- CREATING ROLE TABLE
CREATE TABLE
    "role" (
        "role" varchar(40) NOT NULL,
        "description" varchar,
        PRIMARY KEY ("role")
    );

-- CREATING MEMBER TABLE
CREATE TABLE
    "member" (
        "id" SERIAL,
        "refresh_token" varchar,
        "email" varchar NOT NULL,
        "password" varchar(255) NOT NULL,
        "name" varchar NOT NULL,
        "lastname" varchar NOT NULL,
        "role" varchar NOT NULL,
        "verified" boolean NOT NULL DEFAULT false,
        "date" TIMESTAMP,
        PRIMARY KEY ("email"),
        CONSTRAINT "FK_member.role" FOREIGN KEY ("role") REFERENCES "role" ("role")
    );

CREATE TABLE
    "otp_code" (
        "email_member" varchar NOT NULL,
        "code" int NOT NULL,
        "reason" varchar NOT NULL,
        "used" boolean NOT NULL,
        "date" TIMESTAMP,
        CONSTRAINT "FK_membership.email_member" FOREIGN KEY ("email_member") REFERENCES "member" ("email")
    );

-- CREATING TABLE FOR DIFFERENT TYPE OF MEMBERSHIP
CREATE TABLE
    "type_membership" (
        "type" varchar UNIQUE,
        "price_month" int,
        PRIMARY KEY ("type")
    );

-- CREATING A TABLE FOR STATUS membership
CREATE TABLE
    "status_membership" ("status" varchar(30), PRIMARY KEY ("status"));

-- CREATING A TABLE FOR MEMBERSHIP
CREATE TABLE
    "membership" (
        "id" SERIAL,
        "email_member" varchar NOT NULL UNIQUE,
        "type" varchar NOT NULL DEFAULT 'GRATIS',
        "started" TIMESTAMP,
        "finished" TIMESTAMP,
        "status" varchar,
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_membership.email_member" FOREIGN KEY ("email_member") REFERENCES "member" ("email"),
        CONSTRAINT "FK_membership.type" FOREIGN KEY ("type") REFERENCES "type_membership" ("type"),
        CONSTRAINT "FK_membership.status" FOREIGN KEY ("status") REFERENCES "status_membership" ("status")
    );

-- CREATING A TABLE FOR PAYMENT MEMBERSHIP HISTORIAL
CREATE TABLE
    "payment_membership" (
        "id" SERIAL,
        "email_member" varchar NOT NULL,
        "type" varchar NOT NULL,
        "months" int,
        "started" TIMESTAMP,
        "finished" TIMESTAMP,
        "price_month" money,
        "date_payment" TIMESTAMP,
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_payment_membership.email_member" FOREIGN KEY ("email_member") REFERENCES "member" ("email"),
        CONSTRAINT "FK_type_membership.type" FOREIGN KEY ("type") REFERENCES "type_membership" ("type")
    );

-- CREATING THE CUSTOMER TABLE
CREATE TABLE
    "customer" (
        "id" SERIAL,
        "email_member" varchar NOT NULL,
        "email_customer" varchar NOT NULL,
        "name" varchar(40) NOT NULL,
        "lastname" varchar(40),
        "address" varchar(120),
        "sector" varchar(40),
        "house_number" varchar(7),
        "payday" INT NOT NULL,
        "payment_amount" money,
        "date" TIMESTAMP,
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_customer.email_member" FOREIGN KEY ("email_member") REFERENCES "member" ("email")
    );

-- CREATING A TABLE FOR RECEIPT HISTORIAL
CREATE TABLE
    "receipt" (
        "id" SERIAL,
        "email_member" varchar NOT NULL,
        "id_customer" INT NOT NULL,
        "payment_concept" varchar NOT NULL,
        "created_at" TIMESTAMP,
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_receipt.id_customer" FOREIGN KEY ("id_customer") REFERENCES "customer" ("id"),
        CONSTRAINT "FK_receipt.email_member" FOREIGN KEY ("email_member") REFERENCES "member" ("email")
    );

-- CREATING A TABLE FOR LOGIN HISTORIAL
CREATE TABLE
    "login_historial" (
        "id" SERIAL,
        "email_member" varchar NOT NULL,
        "ip_address" varchar(15),
        "log_date" TIMESTAMP,
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_login_historial.email_member" FOREIGN KEY ("email_member") REFERENCES "member" ("email")
    );

-- CREATING A TABLE FOR DATABASE ACTIVITIES
CREATE TABLE
    "database_activity" (
        "from_email" varchar,
        "to_member" varchar,
        "activity" varchar,
        "affected_table" varchar,
        "role" varchar,
        "date" TIMESTAMP,
        CONSTRAINT "FK_database_activity.role" FOREIGN KEY ("role") REFERENCES "role" ("role")
    );

-- INSERTING THE STATIC ROLES
INSERT INTO
    role ("role", "description")
VALUES
    (
        'ADMIN',
        'Este role tiene acesso a manipular y ver todos los datos.'
    );

INSERT INTO
    role ("role", "description")
VALUES
    (
        'INSPECTOR',
        'Este role solo puede ver todos los datos.'
    );

INSERT INTO
    role ("role", description)
VALUES
    (
        'MEMBER',
        'Este roles solo tiene acesso a sus clientes, info sobre su membresia y historial de login.'
    );

-- CREATING STATUS MEMBERSHIP
INSERT INTO
    type_membership (
        type,
        price_month
    )
VALUES
    ('GRATIS', 0);

INSERT INTO
    type_membership (
        type,
        price_month
    )
VALUES
    ('FREE-TRIAL', 0);

INSERT INTO
    type_membership (
        type,
        price_month
    )
VALUES
    ('PREMIUM', 750);

INSERT INTO
    type_membership (
        type,
        price_month
    )
VALUES
    ('LIFETIME', 10500);

-- INSERTING STATUS MEMBERSHIP
INSERT INTO
    status_membership (status)
VALUES
    ('ACTIVA');

INSERT INTO
    status_membership (status)
VALUES
    ('INACTIVA');

-- --------------------------------------------------------------
-- STORED PRECEDURES:
-- STORED PROCEDURE: SIGN UP MEMBER
CREATE PROCEDURE signup_member (
    email_recived varchar,
    password varchar,
    name varchar,
    lastname varchar
) LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO member (email, password, name, lastname, role, date) VALUES (email_recived, password, name, lastname, 'MEMBER', now());
COMMIT;
	INSERT INTO membership (email_member, type, status) VALUES ((SELECT email FROM member WHERE email = email_recived), 'GRATIS', (SELECT status FROM status_membership WHERE status = 'ACTIVA'));
COMMIT;
	ROLLBACK;
END;
$$;

-- STORED PROCEDURE: REMOVE A MEMBER AND THEIR STUFF
CREATE PROCEDURE member_remover (from_email varchar, to_email varchar) LANGUAGE plpgsql AS $$

BEGIN

	DELETE FROM payment_membership WHERE email_member = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'PAYMENTS WERE CLEARED, BECAUSE THE MEMBER WAS REMOVED' , 'payment_membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	DELETE FROM membership WHERE email_member = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'MEMBERSHIP WAS CLEARED, BECAUSE THE MEMBER WAS REMOVED' , 'membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	DELETE FROM login_historial WHERE email_member = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'LOGIN HISTORIAL WERE CLEARED, BECAUSE THE MEMBER WAS REMOVED' , 'login_historial', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	DELETE FROM receipt WHERE (SELECT id FROM customer WHERE email_member = to_email) = id_customer;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'RECEIPT HISTORIAL WERE CLEARED, BECAUSE THE MEMBER WAS REMOVED' , 'receipt', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	DELETE FROM customer WHERE email_member = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'CUSTOMER WAS CLEARED, BECAUSE THE MEMBER WAS REMOVED' , 'customer', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	DELETE FROM otp_code WHERE email_member = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'OTP CODES WAS CLEARED, BECAUSE THE MEMBER WAS REMOVED' , 'otp_code', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	DELETE FROM "member" WHERE email = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'THE MEMBER WAS REMOVED' , 'member', (SELECT role FROM member WHERE email = from_email), now());

COMMIT;
	ROLLBACK;
END;
$$;

-- FUNCTION for generate a random code for "new_otpcode" procedure
CREATE
OR REPLACE FUNCTION random_between (low INT, high INT) RETURNS INT AS $$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;

-- STORED PROCEDURE: new_otpcode
CREATE PROCEDURE new_otpcode (
    verified_from_email varchar,
    email_to_verify varchar,
    "reason_received" varchar
) LANGUAGE plpgsql AS $$
BEGIN

INSERT INTO otp_code (email_member, code, reason, used, date) VALUES (email_to_verify, (SELECT random_between(10000,99999)), reason_received, false, now());

INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (verified_from_email, email_to_verify, concat('The OTP code was generated ith the reason of ', reason_received), 'otp_code', (SELECT role FROM member WHERE email = verified_from_email), now());
COMMIT;
END;
$$;

-- STORED PROCEDURE: VERIFY A MEMBER
CREATE PROCEDURE verify_member (
    verified_from_email varchar,
    email_to_verify varchar
) LANGUAGE plpgsql AS $$

BEGIN

UPDATE otp_code set used = true WHERE email_member = email_to_verify;
INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (verified_from_email, email_to_verify, concat('The OTP code was used') , 'otp_code', (SELECT role FROM member WHERE email = verified_from_email), now());

UPDATE member set verified = true WHERE email = email_to_verify;
INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (verified_from_email, email_to_verify, 'The account member is now verified' , 'member', (SELECT role FROM member WHERE email = verified_from_email), now());

COMMIT;
END;

$$;

CREATE PROCEDURE update_refreshtoken (to_email varchar, new_refreshToken varchar) LANGUAGE plpgsql AS $$

BEGIN
    UPDATE member SET "refresh_token" = new_refreshToken WHERE email = to_email;
COMMIT;
END;

$$;

CREATE PROCEDURE delete_refreshtoken (to_email varchar) LANGUAGE plpgsql AS $$

BEGIN
    UPDATE member SET "refresh_token" = null WHERE email = to_email;
COMMIT;
END;

$$;

-- STORED PROCEDURE: GENERATE A PREMIUM PAYMENT AND GIVE PREMIUM
CREATE PROCEDURE create_premium_payment (
    from_email varchar,
    to_email varchar,
    months int,
    finish_date date
) LANGUAGE plpgsql AS $$
BEGIN

	INSERT INTO payment_membership (email_member, type, months, started, finished, price_month, date_payment)
	VALUES (to_email, 'PREMIUM', months, NOW(), finish_date, (SELECT price_month FROM type_membership WHERE type = 'PREMIUM' ORDER BY price_month desc LIMIT 1), NOW());

	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'PAYMENT INSERTION' , 'payment_membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	UPDATE member SET role = 'MEMBER' WHERE email = to_email;
	
COMMIT;

	UPDATE membership SET type = 'PREMIUM', started = now(), finished = finish_date, status = (SELECT status FROM status_membership WHERE status = 'ACTIVA')
	WHERE email_member = to_email;
	
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'UPDATED TO PREMIUM', 'membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;
ROLLBACK;

END;
$$;

-- STORED PROCEDURE: GENERATE A LIFETIME PAYMENT AND GIVE LIFETIME
CREATE PROCEDURE create_lifetime_payment (from_email varchar, to_email varchar) LANGUAGE plpgsql AS $$
BEGIN

	INSERT INTO payment_membership (email_member, type, months, started, finished, price_month, date_payment)
	VALUES (to_email, 'LIFETIME', null, null, null, (SELECT price_month FROM type_membership WHERE type = 'LIFETIME' ORDER BY price_month desc LIMIT 1), NOW());

	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'PAYMENT INSERTION' , 'payment_membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	UPDATE member SET role = 'MEMBER' WHERE email = to_email;
	
COMMIT;

	UPDATE membership SET type = 'LIFETIME', started = null, finished = null, status = (SELECT status FROM status_membership WHERE status = 'ACTIVA')
	WHERE email_member = to_email;
	
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'UPDATED TO LIFETIME', 'membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;
ROLLBACK;

END;
$$;

-- STORED PROCEDURE: GIVE A FREE-TRIAL MEMBERSHIP
CREATE PROCEDURE create_freetrial_payment (
    from_email varchar,
    to_email varchar,
    months int,
    finish_date date
) LANGUAGE plpgsql AS $$
BEGIN

	INSERT INTO payment_membership (email_member, type, months, started, finished, price_month, date_payment)
	VALUES (to_email, 'FREE-TRIAL', months, NOW(), finish_date, (SELECT price_month FROM type_membership WHERE type = 'FREE-TRIAL' ORDER BY price_month desc LIMIT 1), NOW());

	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'PAYMENT INSERTION' , 'payment_membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	UPDATE member SET role = 'MEMBER' WHERE email = to_email;
	
COMMIT;

	UPDATE membership SET type = 'FREE-TRIAL', started = now(), finished = finish_date, status = (SELECT status FROM status_membership WHERE status = 'ACTIVA')
	WHERE email_member = to_email;
	
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'UPDATED TO FREE-TRIAL', 'membership', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;
ROLLBACK;

END;
$$;

-- STORED PROCEDURE: GIVE FREE MEMBERSHIP
CREATE PROCEDURE assign_free_membership (from_email varchar, to_email varchar) LANGUAGE plpgsql AS $$
BEGIN

	UPDATE membership SET type = 'GRATIS', started = NULL, finished = NULL, status = (SELECT status FROM status_membership WHERE status = 'ACTIVA')
	WHERE email_member = to_email;
	
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'UPDATED TO GRATIS', 'membership', (SELECT role FROM member WHERE email = from_email), now());
	COMMIT;
  ROLLBACK;

	
END;
$$;

-- STORED PROCEDURE: GIVE ADMIN ROLE
CREATE PROCEDURE give_admin_role (from_email varchar, to_email varchar) LANGUAGE SQL AS $$

	UPDATE member SET role = 'ADMIN' WHERE email = to_email AND (SELECT role FROM member WHERE email = from_email) = 'ADMIN' ;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'ROLE UPDATED TO ADMIN', 'member', (SELECT role FROM member WHERE email = from_email), now());

	UPDATE membership SET type = 'PREMIUM', started = NULL, finished = NULL, status = (SELECT status FROM status_membership WHERE status = 'ACTIVA') WHERE email_member = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'STARTED AND FINISHED DATE UPDATED TO NULL AND STATUS ACTIVA', 'membership', (SELECT role FROM member WHERE email = from_email), now());
$$;

-- STORED PROCEDURE: GIVE INSPECTOR ROLE
CREATE PROCEDURE give_inspector_role (from_email varchar, to_email varchar) LANGUAGE SQL AS $$

	UPDATE member SET role = 'INSPECTOR' WHERE email = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'ROLE UPDATED TO INSPECTOR', 'member', (SELECT role FROM member WHERE email = from_email), now());

	UPDATE membership SET started = NULL, finished = NULL, status = (SELECT status FROM status_membership WHERE status = 'ACTIVA') WHERE email_member = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, 'STARTED AND FINISHED DATE UPDATED TO NULL AND STATUS ACTIVA', 'membership', (SELECT role FROM member WHERE email = from_email), now());
$$;

-- STORED PROCEDURE: STATUS MEMBERSHIP UPDATER (ACTIVA and INACTIVA)
CREATE PROCEDURE status_membership_updater (
    from_email varchar,
    to_email varchar,
    new_status varchar
) LANGUAGE SQL AS $$
	UPDATE membership SET status = new_status WHERE email_member = to_email AND (SELECT role FROM member WHERE email = from_email) = 'ADMIN';
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, CONCAT('STATUS MEMBER WAS UPDATED TO ', new_status), 'membership', (SELECT role FROM member WHERE email = from_email), now());

$$;

-- STORED PROCEDURE: PASSWORD CHANGER
CREATE PROCEDURE password_changer (
    from_email varchar,
    to_email varchar,
    new_password varchar
) LANGUAGE SQL AS $$
	UPDATE member SET password = new_password WHERE email = to_email;
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, CONCAT('PASSWORD MEMBER WAS CHANGED TO ', new_password), 'member', (SELECT role FROM member WHERE email = from_email), now());
$$;

-- STORED PROCEDURE: CUSTOMER REGISTER
CREATE PROCEDURE customer_register (
    from_email varchar,
    to_email varchar,
    email_customer_param varchar,
    name varchar,
    lastname varchar,
    address varchar,
    sector varchar,
    house_num varchar,
    payday INT,
    payment_amount bigint
) LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO customer (email_member, email_customer, name, lastname, address, sector, house_number, payday, payment_amount, date) VALUES (to_email, email_customer_param,name, lastname, address, sector, house_num, payday, payment_amount, now());
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, CONCAT('THE CUSTOMER ', name, ' ', lastname, ' WAS REGISTERED'), 'customer', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;
ROLLBACK;

END;
$$;

-- STORED PROCEDURE: CUSTOMER REMOVER
CREATE PROCEDURE customer_remover (
    from_email varchar,
    to_email varchar,
    to_id_customer int
) LANGUAGE plpgsql AS $$

BEGIN
	DELETE FROM receipt WHERE id_customer = to_id_customer AND (SELECT type FROM membership WHERE email_member = from_email) != 'GRATIS';
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, CONCAT('THE RECEIPTS BELONG TO ', (SELECT name FROM customer WHERE to_id_customer = id), ' ', (SELECT lastname FROM customer WHERE to_id_customer = id), ' WAS REMOVED'), 'receipt', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	DELETE FROM customer WHERE id = to_id_customer AND (SELECT type FROM membership WHERE email_member = from_email) != 'GRATIS';
	INSERT INTO database_activity (from_email, to_member, activity, affected_table, role, date) VALUES (from_email, to_email, CONCAT('CUSTOMER ', (SELECT name FROM customer WHERE to_id_customer = id), ' ', (SELECT lastname FROM customer WHERE to_id_customer = id), ' WAS REMOVED'), 'customer', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;
ROLLBACK;
END;
$$;

-- STORED PROCEDURE: CREATE A RECEIPT
CREATE PROCEDURE create_receipt (
    from_email varchar,
    to_email varchar,
    to_id_customer int,
    new_payment_concept varchar
) LANGUAGE plpgsql AS $$

BEGIN
	INSERT INTO receipt (email_member, id_customer, payment_concept, created_at) VALUES (to_email, to_id_customer, new_payment_concept, now());
	
	INSERT INTO database_activity (from_email, "to_member", activity, affected_table, role, date) 
	VALUES (from_email, to_email, CONCAT('RECEIPT FOR ', (SELECT name FROM customer WHERE id = to_id_customer), ' ', (SELECT lastname FROM customer WHERE id = to_id_customer), ' WAS CREATED'), 'receipt', (SELECT role FROM member WHERE email = from_email), now());
COMMIT;

	ROLLBACK;

END;
$$;

-- -------------------------------------------------------------------------
-- VIEWS
-- CREATING A VIEW FOR MEMBER DATA
DROP VIEW v_member_auth;
CREATE VIEW
    v_member_auth AS
SELECT
    email,
    password,
    m.role,
    m.verified,
    ms.type as membership_type,
    ms.started as membership_started,
    ms.finished as membership_finished,
    ms.status as membership_status
FROM
    member m
    INNER JOIN membership ms ON m.email = ms.email_member
GROUP BY
    m.email,
    m.password,
    m.role,
    m.verified,
    ms.type,
    ms.started,
    ms.finished,
    ms.status;

CREATE VIEW
    v_member AS
SELECT
    m.refresh_token,
    m.email,
    m.name,
    m.lastname,
    m.role,
    m.verified,
    m.date as date_registred,
    ms.type as membership_type,
    ms.started as membership_started,
    ms.finished as membership_finished,
    ms.status as membership_status
FROM
    member m
    INNER JOIN membership ms ON m.email = ms.email_member
GROUP BY
    m.refresh_token,
    m.email,
    m.name,
    m.lastname,
    m.role,
    m.verified,
    m.date,
    ms.type,
    ms.started,
    ms.finished,
    ms.status;

-- CREATING A VIEW FOR CUSTOMER
CREATE VIEW
    v_customers AS
SELECT
    *
FROM
    customer;

-- CREATING A VIEW FOR RECEIPT
CREATE VIEW
    v_receipts AS
SELECT
    r.id,
    r.email_member,
    r.id_customer,
    r.payment_concept,
    r.created_at,
    c."name",
    c."lastname",
    c.address,
    c.sector,
    c.payday,
    c.payment_amount
FROM
    receipt r
    INNER JOIN customer c ON r.id_customer = c.id
GROUP BY
    r.id,
    r.email_member,
    r.id_customer,
    r.payment_concept,
    r.created_at,
    c."name",
    c."lastname",
    c.address,
    c.sector,
    c.payday,
    c.payment_amount;

-- CREATING A VIEW FOR LOGIN HISTORIAL
CREATE VIEW
    v_login_historial AS
SELECT
    *
FROM
    login_historial;

-- CREATING A VIEW FOR DATABASE ACTIVITIES (CHANGES MADE)
CREATE VIEW
    v_database_activities AS
SELECT
    *
FROM
    database_activity;

-- CREATING A VIEW  FOR GETTING ALL COLUMN OF PAYMENT MEMBERSHIP TABLE
CREATE VIEW
    v_payment_historial AS
SELECT
    *
FROM
    payment_membership;

-- -- CREATING ADMIN MEMBER
-- UPDATE member
-- SET role = 'ADMIN',
-- verified = true
-- WHERE
--     email = 'admin@admin.com';

-- CALL give_admin_role ('admin@admin.com', 'admin@admin.com')
-- -- -- -- -- ----
-- UPDATE membership SET finished = '2023-02-08T22:09:00.000Z' WHERE email_member = 'carmen@carmen.com';