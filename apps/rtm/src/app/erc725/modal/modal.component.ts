import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'lukso-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  decline() {}
  approve() {}
}
