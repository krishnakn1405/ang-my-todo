import { Component, ViewChild, ElementRef } from '@angular/core';
import { Notes } from 'src/app/notes';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent {

  fullWidth: Boolean = false;
  selectObject: Object = [];
  selectedMode: Boolean = false;
  holdTimeout;
  touched: Boolean = true;
  linkClick: Boolean = true;

  localItem: string;
  notes: Notes[];
  archived: Notes[] = [];

  @ViewChild('fullWidthIcon', { static: true }) fullWidthIcon: ElementRef;
  @ViewChild('selectedNavbar', { static: true }) selectedNavbar: ElementRef;
  @ViewChild('totalSelect', { static: true }) totalSelect: ElementRef;
  @ViewChild('navMenuToggleId', { static: true }) navMenuToggleId: ElementRef;
  @ViewChild('alertModel', { static: true }) alertModel: ElementRef;

  constructor() {
    this.localItem = localStorage.getItem("notes");

    if (this.localItem == null) {
      this.notes = [];
    } else {
      this.notes = JSON.parse(this.localItem)
    }

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      if (this.notes[i1].delete == false && this.notes[i1].archive == true) {
        this.archived.push(this.notes[i1]);
      }
    }

  }

  navMenuToggle() {
    const navMenuToggleId = this.navMenuToggleId.nativeElement;
    if (navMenuToggleId.style.width == "0vw") {
      navMenuToggleId.style.opacity = "1";
      navMenuToggleId.style.width = "90vw";
    } else {
      navMenuToggleId.style.opacity = "0";
      navMenuToggleId.style.width = "0vw";
    }

  }

  fullNotes() {
    const fullWidthIcon = this.fullWidthIcon.nativeElement;
    if (this.fullWidth) {
      this.fullWidth = false;
      fullWidthIcon.style.color = '#40474d';
    } else {
      this.fullWidth = true;
      fullWidthIcon.style.color = '#63c5da';
    }
  }

  closeSelected() {

    const selectedNavbar = this.selectedNavbar.nativeElement;

    for (const key in this.selectObject) {
      let notesId = this.selectObject[key];
      let modal = document.getElementById(notesId);
      modal.style.border = '';
      delete this.selectObject[key];
    }
    this.selectedMode = false;
    this.touched = true;
    selectedNavbar.style.opacity = "0";
    selectedNavbar.style.height = "0vw";
  }

  unarchiveNotes() {
    const selectedNavbar = this.selectedNavbar.nativeElement;

    for (let key in this.selectObject) {
      for (let i1 = 0; i1 < this.notes.length; i1++) {
        // Search for same note
        if (this.notes[i1].id == parseInt(key)) {
          this.notes[i1].archive = false;
          for (let j1 = 0; j1 < this.archived.length; j1++) {
            if (this.archived[j1].id == this.notes[i1].id) {
              this.archived.splice(j1, 1);
            }
          }
          break;
        }
      }
    }

    localStorage.setItem("notes", JSON.stringify(this.notes));

    this.selectObject = [];
    this.selectedMode = false;
    this.touched = true;
    this.linkClick = true;
    selectedNavbar.style.opacity = "0";
    selectedNavbar.style.height = "0vw";

    const alertModel = this.alertModel.nativeElement;
    alertModel.style.opacity = "1";
    alertModel.innerHTML = "<p><strong>Alert: </strong>Note is unarchived</p>";
    setTimeout(() => {
      alertModel.style.opacity = "0";
    }, 2000);

  }

  deleteNotes() {

    const selectedNavbar = this.selectedNavbar.nativeElement;

    for (let key in this.selectObject) {
      for (let i1 = 0; i1 < this.notes.length; i1++) {
        // Search for same note
        if (this.notes[i1].id == parseInt(key)) {
          this.notes[i1].delete = true;
          for (let j1 = 0; j1 < this.archived.length; j1++) {
            if (this.archived[j1].id == this.notes[i1].id) {
              this.archived.splice(j1, 1);
            }
          }
          break;
        }
      }
    }

    localStorage.setItem("notes", JSON.stringify(this.notes));


    this.selectObject = [];
    this.selectedMode = false;
    this.touched = true;
    this.linkClick = true;
    selectedNavbar.style.opacity = "0";
    selectedNavbar.style.height = "0vw";

    const alertModel = this.alertModel.nativeElement;
    alertModel.style.opacity = "1";
    alertModel.innerHTML = "<p><strong>Alert: </strong>Note moved to bin</p>";
    setTimeout(() => {
      alertModel.style.opacity = "0";
    }, 2000);

  }

  onTouchStart(id) {
    // Handle touchstart logic here
    let notes = String("notes" + id);
    let modal = document.getElementById(notes);

    const selectedNavbar = this.selectedNavbar.nativeElement;
    const totalSelect = this.totalSelect.nativeElement;

    if (this.selectedMode) {

      if (this.selectObject.hasOwnProperty(id)) {
        delete this.selectObject[id];
        modal.style.border = '';
      } else {
        this.selectObject[id] = notes;
        modal.style.border = '3px solid #00668c';
      }

      totalSelect.innerHTML = String(Object.keys(this.selectObject).length);

      let keys = Object.keys(this.selectObject);

      if (keys.length == 0) {
        this.selectedMode = false;
        this.touched = true;
        selectedNavbar.style.opacity = "0";
        selectedNavbar.style.height = "0vw";

        if (this.touched) {
          setTimeout(() => {
            this.linkClick = true;
          }, 1000);
        }
      }

    } else {
      this.holdTimeout = setTimeout(() => {
        if (this.touched) {
          this.selectObject[id] = notes;
          modal.style.border = '3px solid #00668c';
          this.selectedMode = true;
          this.touched = false;
          this.linkClick = false;
          selectedNavbar.style.opacity = "1";
          selectedNavbar.style.height = "18vw";
          totalSelect.innerHTML = String(Object.keys(this.selectObject).length);
        }
      }, 500);

    }

  }

  onTouchEnd() {
    // Handle touchend logic here
    clearTimeout(this.holdTimeout);
  }

}
