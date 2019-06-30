/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom Services */
import { SystemService } from 'app/system/system.service';

/**
 * Create Survey Component.
 */
@Component({
  selector: 'mifosx-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {

  /** Survey Form. */
  surveyForm: FormGroup;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SystemService} systemService System Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   */
  constructor(private formBuilder: FormBuilder,
              private systemService: SystemService,
              private router: Router,
              private route: ActivatedRoute) { }

  /**
   * Creates the survey form.
   */
  ngOnInit() {
    this.createSurveyForm();
  }

  /**
   * Creates the survey form.
   */
  createSurveyForm() {
    this.surveyForm = this.formBuilder.group({
      'key': ['', Validators.required],
      'name': ['', Validators.required],
      'countryCode': ['', Validators.required],
      'description': [''],
      'questionDatas': this.formBuilder.array([this.createQuestionDataForm(0)])
    });
  }

  /**
   * Creates the question data form.
   * @param {number} index Index of the row.
   * @returns {FormGroup} Question data form.
   */
  createQuestionDataForm(index: number): FormGroup {
    return this.formBuilder.group({
      'key': ['', Validators.required],
      'text': ['', Validators.required],
      'description': [''],
      'sequenceNo': [index + 1],
      'responseDatas': this.formBuilder.array([this.createResponseDataForm(0)])
    });
  }

  /**
   * Gets the question datas form array.
   * @returns {FormArray} Question datas form array.
   */
  get questionDatas(): FormArray {
    return this.surveyForm.get('questionDatas') as FormArray;
  }

  /**
   * Adds the question data form to given question datas form array.
   */
  addQuestionData() {
    this.questionDatas.push(this.createQuestionDataForm(this.questionDatas.length));
  }
  
  /**
   * Removes the question data form to given question datas form array.
   * @param {number} index Index of the row.
   */
  removeQuestionData(index: number) {
    this.questionDatas.removeAt(index);
  }

  /**
   * Creates the response data form.
   * @param {number} index Index of the row.
   * @returns {FormGroup} Response data form.
   */
  createResponseDataForm(index: number): FormGroup {
    return this.formBuilder.group({
      'text': ['', Validators.required],
      'value': ['', Validators.required],
      'sequenceNo': [index + 1]
    });
  }

  /**
   * Gets the response datas form array.
   * @param {number} indexOfQuestion Index of the question row.
   */
  responseDatas(indexOfQuestion: number): FormArray {
    return this.questionDatas.at(indexOfQuestion).get('responseDatas') as FormArray;
  }

  /**
   * Adds the response data form to given response datas form array.
   * @param {number} indexOfQuestion Index of the Question Row.
   */
  addResponseData(indexOfQuestion: number) {
    let responseDatas = this.questionDatas.at(indexOfQuestion).get('responseDatas') as FormArray;
    responseDatas.push(this.createResponseDataForm(responseDatas.length));
  }

  /**
   * Removes the response data form to given response datas form array.
   * @param {number} indexOfQuestion Index of the Question Row.
   * @param {number} indexOfResponse Index of the Response Row.
   */
  removeResponseData(indexOfQuestion: number, indexOfResponse: number) {
    let responseDatas = this.questionDatas.at(indexOfQuestion).get('responseDatas') as FormArray;
    responseDatas.removeAt(indexOfResponse);
  }

  /**
   * Submits the survey form and creates survey,
   * if successful redirects to view created survey.
   */
  submit() {
    this.systemService.createSurvey(this.surveyForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../', response.resourceId], { relativeTo: this.route });
    });
  }

}
