import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigSiteService {

  apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  statusLinkCurto(){
    return this.http.get<boolean>(`${this.apiUrl}/scraper/status-link_curto`)
  }

  statusLinkSemDominioOmc(){
    return this.http.get<boolean>(`${this.apiUrl}/config-site/status-link-sem-dominio-omc`)
  }
}
