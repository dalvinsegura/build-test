import pdf from 'html-pdf';
import pdfTemplate from "../documents";

export const createPdf = (req, res) => {
    try {
        pdf.create(pdfTemplate(req.body), {}).toFile(`${__dirname}/result.pdf`, (err) => {
            if(err) {
                res.send(Promise.reject());
            }
    
            res.send(Promise.resolve());
        });
    } catch (error) {
        console.log(error)
    }
}

export const fetchPdf = (req, res) => {
    console.log()
try {
    res.sendFile(`${__dirname}/result.pdf`)
} catch (error) {
    console.log(error)
}

};