import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as converter from 'xml-js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  formGroup: FormGroup;
  outputXml: any;
  invoice: any;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.onCreateForm();
  }

  onCreateForm() {
    this.formGroup = this._fb.group({
      chave: null,
      numeroNfe: null,
      dataEmissao: null,
      valorProdutos: null,
      valorTotal: null,
    });
  }

  onSelectFile(event) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let xml = e.target.result;
      let result1 = converter.xml2json(xml, { compact: true, spaces: 2 });
      const JSONData = JSON.parse(result1);

      this.invoice = JSONData;

      this.formGroup.patchValue({
        chave: this.invoice.nfeProc.protNFe.infProt.chNFe._text,
        numeroNfe: this.invoice.nfeProc.NFe.infNFe.ide.nNF._text,
        dataEmissao: this.invoice.nfeProc.NFe.infNFe.ide.dhEmi._text,
        valorTotal: this.invoice.nfeProc.NFe.infNFe.total.ICMSTot.vNF._text,
        valorProdutos:
          this.invoice.nfeProc.NFe.infNFe.total.ICMSTot.vProd._text,
      });
    };
    reader.readAsText(event.target.files[0]);
  }

  onSave() {
    const str = JSON.stringify(this.formGroup.value);
    this.outputXml = converter.json2xml(str, { compact: true, spaces: 4 });
  }
}
