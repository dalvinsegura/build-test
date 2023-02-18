export const pdfTemplate = ({
  idReceipt,
  customerFullName,
  memberFullName,
  amountDetailed,
  amountSimplified,
  paymentConcept,
  date,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>PDF Result Template</title>
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        border: 0;
        outline: none;
    }
    
    .receipt-container{
        width: 95vw;
        height: 70%;
        // max-height: 65vh;
        // background: #000;
        margin: 5% auto 0;
        padding: 0.7vw;
    
        border: #000 0.2vw solid;
        border-radius: 10px;
        font-family: Arial, Helvetica, sans-serif;
    }
    
    .receipt-container .header-receipt-container{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 4vw;
        margin-top: 0.3vw;
    }
    
    .header-receipt-container .title-receipt{
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 2vw;
    }
    
    .header-receipt-container .date-and-receiptid{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    
    .date-and-receiptid .receiptid{
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 1.4vw;
    }
    
    .date-and-receiptid .receiptid span{
        color: red;
        font-weight: 400;
    }
    
    .date-and-receiptid .date{
        font-weight: 700;
        font-size: 1.3vw;
        margin-top: 0.6vw;
    }
    
    .data-container{
        width: 100%;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr 2fr;
    }
    
    .data-container .row-data{
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
    
        margin-top: 2vw;
    }
    
    .data-container .row-data > * {
        display: inline-flex;
        
    }
    
    .data-container .row-data .title-field{
        flex-grow: 1;
    }
    .data-container .row-data .data-field{
        flex-grow: 2;
    }
    
    .data-container .row-2 .not-grow{
        flex-grow: 0;
    }
    
    .row-data .title-field{
        font-weight: 700;
        font-size: 1.5vw;
        width: 100%;
    
    }
    
    .row-data .data-field {
        font-weight: 400;
        font-size: 1.4vw;
        border-bottom: 0.2vw solid #000;
        
        margin: 0 1.2vw;
        float: right;
    }
    
    .row-2 .pesos{
        margin-left: 2vw;
    }
    
    .data-container .row-3{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        /* margin-top: 10; */
    }
    
    .row-3 .sign{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        text-align: center;
        
    }
    
    .sign .title-field{
        font-weight: 700;
        font-size: 1.15vw;
        margin-top: 0.2vw;
    }
    
    .row-3 .data-field {
        padding: 0 2vw;
    }
    
    .row-3 .data-field, .row-3 .empy-sign{
        border-bottom: 0.2vw solid #000;
    }
    
    .row-3 .sign-2 .empy-sign{
        width: 30vw;
        background: #000;
    }
    </style>
</head>

<body>
    <div class="receipt-container">

        <div class="header-receipt-container">
            <h1 class="title-receipt">RECIBO DE DESEMBOLSO</h1>
            <div class="date-and-receiptid">
                <p class="receiptid">NO. <span>${idReceipt}</span></p>
                <p class="date">${date}</p>
            </div>
        </div>

        <div class="data-container">
            <div class="row-data row-1">
                <h2 class="title-field">HEMEOS ENTREGADO A:
                <p class="data-field">${customerFullName}</p>
            </div>

            <div class="row-data row-2">
                <h2 class="title-field">LA SUMA DE:
                <p class="data-field">${amountDetailed}</p>
                <h2 class="title-field pesos">PESOS RD$:
                <p class="data-field not-grow">${amountSimplified}</p>
            </div>

            <div class="row-data row-2">
                <h2 class="title-field">POR CONCEPTO DE:
                <p class="data-field">${paymentConcept}</p>
            </div>

            <div class="row-3">
                <div class="sign sign-1">
                    <p class="data-field">${memberFullName}</p>
                <h2 class="title-field">FIRMA
                </div>

                <div class="sign sign-2">
                    <div class="empy-sign"></div>
                <h2 class="title-field">FIRMA
                </div>
            </div>
            
            </h2>
        </div>


    </div>
</body>
</html>
    `;
};

export default pdfTemplate;
