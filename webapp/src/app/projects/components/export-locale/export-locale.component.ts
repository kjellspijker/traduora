import { Component, Input, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { errorToMessage } from '../../../shared/util/api-error';
import { ExportFormat, EXPORT_FORMATS } from '../../models/export';
import { Locale } from '../../models/locale';
import { Project } from '../../models/project';
import { ExportService } from '../../services/export.service';
import {Local} from 'protractor/built/driverProviders';
import {debug} from 'util';

@Component({
  selector: 'app-export-locale',
  templateUrl: './export-locale.component.html',
  styleUrls: ['./export-locale.component.css'],
})
export class ExportLocaleComponent implements OnInit {
  @Input()
  project: Project;

  @Input()
  locales: Locale[];

  private loadingCount = 0;

  @Input()
  loading = this.loadingCount > 0;

  selectedLocale: [Locale?] = [];
  selectedFormat: ExportFormat;
  availableFormats = EXPORT_FORMATS;

  errorMessage: string;

  constructor(private exportService: ExportService) {}

  ngOnInit() {}

  validInputs() {
    return !!this.selectedFormat && this.selectedLocale.length > 0;
  }

  selectLocale(locale: Locale) {
    this.selectedLocale.push(locale);
  }

  deselectLocale(locale: Locale) {
    this.selectedLocale.splice(this.selectedLocale.indexOf(locale), 1);
  }

  async export() {
    if (!this.validInputs()) {
      return;
    }

    this.errorMessage = undefined;
    this.loadingCount = 0;

    debugger
    for (const locale of this.selectedLocale) {
      this.loadingCount++;
      await this.exportService
        .exportAndDownload(this.project.id, locale.code, this.selectedFormat)
        .pipe(
          catchError(error => {
            this.errorMessage = errorToMessage(error, 'ExportLocale');
            return throwError(error);
          }),
          finalize(() => {
            this.loadingCount--;
            debugger
          })
        );
    }
  }
}
