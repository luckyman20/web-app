/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

/** Custom Services */
import { SystemService } from 'app/system/system.service';

/**
 * Edit Survey Component.
 */
@Component({
  selector: 'mifosx-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.scss']
})
export class EditSurveyComponent implements OnInit {

  /** Survey Data. */
  surveyData: any;
  /** Survey Form. */
  surveyForm: FormGroup;

  /**
   * Retrieves the survey data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router.
   * @param {SystemService} systemService System Service.
   * @param {FormBuilder} formBuilder Form Builder.
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private systemService: SystemService,
              private formBuilder: FormBuilder) {
    this.route.data.subscribe((data: { survey: any }) => {
      this.surveyData = data.survey;
    })
  }

  /**
   * Creates and sets the survey form.
   */
  ngOnInit() {
    this.createSurveyForm(this.surveyData);
    for (let index = 0; index < this.surveyData.questionDatas.length; index++) {
      this.questionDatas.push(this.createQuestionDataForm(this.surveyData.questionDatas[index]));
      this.surveyData.questionDatas[index].responseDatas.map((responseData: any) => this.responseDatas(index).push(this.createResponseDataForm(responseData)));
    }
  }

  /**
   * Creates and sets the survey form.
   * @param {any} survey Survey.
   */
  createSurveyForm(survey?: any) {
    this.surveyForm = this.formBuilder.group({
      'key': [survey ? survey.key : '', Validators.required],
      'name': [survey ? survey.name : '', Validators.required],
      'countryCode': [survey ? survey.countryCode : '', Validators.required],
      'description': [survey ? survey.description : ''],
      'questionDatas': this.formBuilder.array([])
    });
  }

  /**
   * Creates the question data form.
   * @param {any} questionData Question Data.
   * @param {number} index Index of the row.
   * @returns {FormGroup} Question data form.
   */
  createQuestionDataForm(questionData?: any, index?: number): FormGroup {
    return this.formBuilder.group({
      'key': [questionData ? questionData.key : '', Validators.required],
      'text': [questionData ? questionData.text : '', Validators.required],
      'description': [questionData ? questionData.description : ''],
      'sequenceNo': [questionData ? questionData.sequenceNo : index + 1],
      'responseDatas': this.formBuilder.array([])
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
   * @param {any} responseData Response Data.
   * @param {number} index Index of the row.
   * @returns {FormGroup} Response data form.
   */
  createResponseDataForm(responseData?: any, index?: number): FormGroup {
    return this.formBuilder.group({
      'text': [responseData ? responseData.text : '', Validators.required],
      'value': [responseData ? responseData.value : '', Validators.required],
      'sequenceNo': [responseData ? responseData.value : index + 1]
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
   * @param {number} index Index of the row.
   */
  addResponseData(index: number) {
    let responseDatas = this.questionDatas.at(index).get('responseDatas') as FormArray;
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
   * Submits the survey form and updates survey,
   * if successful redirects to view updated survey.
   */
  submit() {
    this.systemService.updateSurvey(this.surveyData.id, this.surveyForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

}
