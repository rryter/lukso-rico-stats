import { skip } from 'rxjs/operators';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslationModule } from '@mobi/rwc-utils-ng-jslib';
import { CheckboxModule, MobiInputGroupModule, SearchFieldModule } from '@mobi/rwc-uxframework-ng';
import { SharedTestHelper } from '@shared/test/shared.test-helper';
import { ListCheckboxComponent } from './list-checkbox.component';

describe('ListCheckboxComponent', () => {
    let fixture: ComponentFixture<ListCheckboxComponent>;
    let component: ListCheckboxComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ListCheckboxComponent],
            imports: [
                ReactiveFormsModule,
                MobiInputGroupModule,
                CheckboxModule,
                SearchFieldModule,
                TranslationModule,
                ScrollingModule,
                HttpClientTestingModule,
            ],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ListCheckboxComponent);
        component = fixture.componentInstance;
        component.items = [
            { label: 'Label 1', value: 1 },
            { label: 'Label 2', value: 2 },
            { label: 'Label 3', value: 3 },
            { label: 'Label 4', value: 4 },
            { label: 'Label 5', value: 5 },
            { label: 'Label 6', value: 6 },
            { label: 'Label 7', value: 7 },
            { label: 'Label 8', value: 8 },
            { label: 'Label 9', value: 9 },
        ];
        component.selected = [2, 3];

        component.ngOnChanges({
            items: new SimpleChange(null, component.items, true),
            selected: new SimpleChange(null, [2, 3], true),
        });

        fixture.detectChanges();
    });

    it('should create instance', () => {
        expect(component.form.value).toEqual({
            allSelected: false,
            checkboxes: [
                { label: 'Label 1', value: 1, selected: false },
                { label: 'Label 2', value: 2, selected: true },
                { label: 'Label 3', value: 3, selected: true },
                { label: 'Label 4', value: 4, selected: false },
                { label: 'Label 5', value: 5, selected: false },
                { label: 'Label 6', value: 6, selected: false },
                { label: 'Label 7', value: 7, selected: false },
                { label: 'Label 8', value: 8, selected: false },
                { label: 'Label 9', value: 9, selected: false },
            ],
            searchField: '',
        });
    });

    it('toggleAll should emit each time', () => {
        spyOn(component.selectionChanged, 'emit');

        component.toggleAll(component.items, true);
        expect(component.form.value.allSelected === true);
        expect(component.form.value.checkboxes[0].selected).toBe(true);
        expect(component.form.value.checkboxes[1].selected).toBe(true);
        expect(component.selectionChanged.emit).toHaveBeenCalledTimes(1);

        component.toggleAll(component.items, true);
        expect(component.selectionChanged.emit).toHaveBeenCalledTimes(2);
    });

    it('filteredCheckboxes$ should return visible items', (done) => {
        component.filteredCheckboxes$.pipe(skip(1)).subscribe((result) => {
            expect(result.length).toBe(1);
            done();
        });
        const searchField = component.form.get('searchField');
        if (searchField) {
            searchField.setValue('Label 1', { emitEvent: false });
        }
    });

    it('should be fast', () => {
        component.items = [...Array(5000).keys()].map((i) => {
            return { label: 'Label' + i, value: i };
        });

        component.selected = [2, 3, 5];

        component.ngOnChanges({
            items: new SimpleChange(null, component.items, true),
            selected: new SimpleChange(null, [2, 3, 5], true),
        });

        fixture.detectChanges();
    });

    describe('ngOnChanges', () => {
        it('should set selected', () => {
            component.ngOnChanges({
                selected: new SimpleChange(null, [1, 2], true),
            });

            fixture.detectChanges();

            expect(component.selectedItems.map((item) => item.value)).toEqual([1, 2]);
        });

        it('should not set all selected', () => {
            component.ngOnChanges({
                selected: new SimpleChange(null, [1, 2], true),
            });

            fixture.detectChanges();

            expect(component.allSelected.value).toEqual(false);
        });

        it('should set all selected', () => {
            component.ngOnChanges({
                selected: new SimpleChange(null, [1, 2, 3, 4, 5, 6, 7, 8, 9], true),
            });

            fixture.detectChanges();

            expect(component.allSelected.value).toEqual(true);
        });
    });

    describe('disable mode', () => {
        it('do not show', () => {
            component.disabled = true;
            component.ngOnChanges({
                selected: new SimpleChange(null, [], true),
            });

            fixture.detectChanges();

            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divNichtSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divAlleSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divTeilweiseSelektiert');
        });

        it('nothingSelected', () => {
            component.disabled = true;
            component.nothingSelectedLabel = 'the label';
            component.ngOnChanges({
                selected: new SimpleChange(null, [], true),
            });

            fixture.detectChanges();

            SharedTestHelper.expectElementByCss(fixture.debugElement, '#divNichtSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divAlleSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divTeilweiseSelektiert');
        });

        it('partlySelected', () => {
            component.disabled = true;
            component.ngOnChanges({
                selected: new SimpleChange(null, [1, 2], true),
            });

            fixture.detectChanges();

            SharedTestHelper.expectElementByCss(fixture.debugElement, '#divTeilweiseSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divAlleSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divNichtSelektiert');
        });

        it('partlySelected with scrollbar', () => {
            component.disabled = true;
            component.ngOnChanges({
                selected: new SimpleChange(null, [1, 2, 3, 4, 5, 6, 7, 8], true),
            });

            fixture.detectChanges();

            SharedTestHelper.expectElementByCss(fixture.debugElement, '#divTeilweiseSelektiertMitScrollbar');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divAlleSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divNichtSelektiert');
        });

        it('allSelected', () => {
            component.disabled = true;
            component.ngOnChanges({
                selected: new SimpleChange(null, [1, 2, 3, 4, 5, 6, 7, 8, 9], true),
            });

            fixture.detectChanges();

            SharedTestHelper.expectElementByCss(fixture.debugElement, '#divAlleSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divTeilweiseSelektiert');
            SharedTestHelper.dontExpectElementByCss(fixture.debugElement, '#divNichtSelektiert');
        });
    });
});
