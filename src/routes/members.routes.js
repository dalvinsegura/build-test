import {Router} from "express";
const router = Router();
import * as memberCtrl from '../controllers/members.controller';
import { authJwt } from "../middlewares/";


router.get('/', [authJwt.verifyToken, authJwt.isAdmin], memberCtrl.getMembers);

router.get('/me', authJwt.verifyToken, memberCtrl.getMemberByEmail);

router.delete('/', [authJwt.verifyToken, authJwt.isAdmin], memberCtrl.deleteMemberById);

export default router;