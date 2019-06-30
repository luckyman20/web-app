/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { SystemService } from '../system.service';

/**
 * Manage Surveys component.
 */
@Component({
  selector: 'mifosx-manage-surveys',
  templateUrl: './manage-surveys.component.html',
  styleUrls: ['./manage-surveys.component.scss'],
})
export class ManageSurveysComponent implements OnInit {

  /* Surveys data */
  surveysData: any;
  /* Columns to be displayed in manage surveys data table */
  displayedColumns: string[] = ['key', 'name', 'description', 'countryCode', 'status', 'action'];
  /* Data source for manage surveys data table */
  dataSource: MatTableDataSource<any>;

  /** Paginator for manage surveys table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for manage surveys table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the surveys data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {SystemService} systemService System Service.
   */
  constructor(private route: ActivatedRoute,
              private systemService: SystemService,
              private router: Router) {
    this.route.data.subscribe(( data: { surveys: any }) => {
      this.surveysData = data.surveys;
    });
  }

  /**
   * Returns whether an survey is active based on its duration
   * @param {number} validFrom Date valid from
   * @param {number} validTo Date valid to
   */
  isActive(validFrom: number, validTo: number) {
    const curdate = new Date().getTime();
    return (curdate > validFrom && curdate < validTo);
  }

  /**
   * Sets the manage surveys table. And initiates button and action sort
   */
  ngOnInit() {
    this.setSurveys();
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'status': return this.isActive(item.validFrom, item.validTo);
        case 'action': return this.isActive(item.validFrom, item.validTo);
        default: return item[property];
      }
    };
  }

  /**
   * Initializes the data source, paginator and sorter for surveys table.
   */
  setSurveys() {
    this.dataSource = new MatTableDataSource(this.surveysData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Filters data in surveys table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSurveyStatus(surveyId: string, command: string, event: Event) {
    event.stopPropagation();
    this.systemService.toggleSurveyStatus(surveyId, command)
      .subscribe((response: any) => {
        if (command === 'activate') {
          this.surveysData[+surveyId - 1].validFrom = new Date().getTime() - 100;
          this.surveysData[+surveyId - 1].validTo = new Date().getTime() + 100;
        } else if (command === 'deactivate') {
          this.surveysData[+surveyId - 1].validFrom = new Date().getTime();
          this.surveysData[+surveyId - 1].validTo = new Date().getTime();
        }
        console.log(this.surveysData[+surveyId - 1]);
      });
  }

}
