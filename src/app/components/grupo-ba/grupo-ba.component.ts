import { LinkBannerService } from './../../service/painel/link-banner.service';
import { Component, OnInit } from '@angular/core';
import { LinksBanner } from 'src/app/dto/LinksBanner';


@Component({
  selector: 'app-grupo-ba',
  templateUrl: './grupo-ba.component.html',
  styleUrls: ['./grupo-ba.component.css']
})
export class GrupoBaComponent implements OnInit {

  links!: LinksBanner;

  constructor(
    private linkBannerService: LinkBannerService
  ){}

  ngOnInit(): void {
    this.pegarLinks()
  }

  pegarLinks() {
    this.linkBannerService.listarLinksEBanners().then(response => {
      this.links = response;
    });
  }

}
