/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

/**
 * View Survey Component.
 */
@Component({
  selector: 'mifosx-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss']
})
export class ViewSurveyComponent implements OnInit {

  /** Survey Data. */
  surveyData: any;
  /** Columns to be displayed in options table */
  displayedColumns: String[] = ['text', 'value'];
  /** Data source for options table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for options table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for options table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the survey data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { survey: any }) => {
      this.surveyData = data.survey;
    })
  }

  ngOnInit() {
  }

}
