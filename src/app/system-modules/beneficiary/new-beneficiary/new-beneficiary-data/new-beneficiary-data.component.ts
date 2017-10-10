import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-new-beneficiary-data',
  templateUrl: './new-beneficiary-data.component.html',
  styleUrls: ['./new-beneficiary-data.component.scss']
})
export class NewBeneficiaryDataComponent implements OnInit {

  @ViewChild('video') video: any;
  @ViewChild('snapshot') snapshot: ElementRef;
  public context: CanvasRenderingContext2D;
  stepOneView: Boolean = true;
  stepTwoView: Boolean = false;
  stepThreeView: Boolean = false;
  stepFourView: Boolean = false;

  _video: any;
  patCanvas: any;
  patData: any;
  patOpts = { x: 0, y: 0, w: 25, h: 25 };

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy', 
  };

  public today: IMyDate;

  stepOneFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.stepOneFormGroup = this._fb.group({
      gender: [''],
      title: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      middleName: [''],
      lastName: ['', [<any>Validators.required]],
      phonenumber: ['', [<any>Validators.required]],
      secondaryPhone: [''],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      dob: ['', [<any>Validators.required]],
      lasrraId: [''],
      stateOfOrigin: ['', [<any>Validators.required]],
      lgaOfOrigin: ['', [<any>Validators.required]],
      maritalStatus: ['', [<any>Validators.required]],
      noOfChildrenU18: ['', [<any>Validators.required]],
      streetName: ['', [<any>Validators.required]],
      lga: ['', [<any>Validators.required]],
      neighbourhood: ['', [<any>Validators.required]],
      mothermaidenname: ['']
    });
  }
  ngAfterViewInit() {
    this._video = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this._video.src = window.URL.createObjectURL(stream);
          this._video.play();
        })
    }
    this.context = this.snapshot.nativeElement.getContext("2d");
  }
  makeSnapshot() {
    console.log(1)
    if (this._video) {
      console.log(2)
      // let patCanvas: any =  this.context;//document.querySelector('#snapshot');
      // if (!patCanvas) return;

      // patCanvas.width = this._video.width;
      // patCanvas.height = this._video.height;
      // var ctxPat = patCanvas.getContext('2d');

      console.log(this.context);

      var idata = this.getVideoData(this.patOpts.x, this.patOpts.y, this.patOpts.w, this.patOpts.h);
      console.log(idata)
      this.context.putImageData(idata, 300, 300);
      // this.context.drawImage(idata, 0, 0, 400, 400);
      console.log(3)
      this.patData = idata;
    }
  };

  getVideoData(x, y, w, h) {
    console.log('2a')
    var hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = this._video.width;
    hiddenCanvas.height = this._video.height;
    var ctx = hiddenCanvas.getContext('2d');
    ctx.drawImage(this._video, 0, 0, this._video.width, this._video.height);
    console.log('2b')
    return ctx.getImageData(x, y, w, h);
  };

}
