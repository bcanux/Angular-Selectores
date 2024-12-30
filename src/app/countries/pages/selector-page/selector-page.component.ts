import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry, Country } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';
import { count } from 'node:console';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{


  private fb = inject(FormBuilder);
  private countriesService = inject(CountriesService);

  public countriesByRegion: SmallCountry[] = [];
  public borders:  SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],

  });

  ngOnInit(): void {

    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[]{
    return this.countriesService.regions;
  }

  onRegionChange(): void{
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap(()=> this.myForm.get('country')!.setValue('')),
      tap(() => this.borders = []),
      switchMap(region => this.countriesService.getCountriesByRegion(region)),
    )
    .subscribe( countries => {
      this.countriesByRegion = countries
      // console.log({region});
    });
  }

   onCountryChange(): void{
    this.myForm.get('country')?.valueChanges
    .pipe(
      tap(()=> this.myForm.get('border')!.setValue('')),
      filter((value: string) =>  value.length > 0), //Se usa para validar si lleva un valor el parámetro
      switchMap(alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode)),
      switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders))
    )
    .subscribe( countries => {
      //this.countriesByRegion = countries
       this.borders = countries;
    });
   }
}
