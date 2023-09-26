import { Component, ViewChild, ElementRef } from '@angular/core';
import { Notes } from 'src/app/notes';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent {

  fullWidth: Boolean = false;
  selectObject: Object = {};
  selectedMode: Boolean = false;
  holdTimeout;
  touched: Boolean = true;
  linkClick: Boolean = false;

  localItem: string;
  notes: Notes[];
  deleted: Notes[] = [];

  @ViewChild('selectedNavbar', { static: true }) selectedNavbar: ElementRef;
  @ViewChild('totalSelect', { static: true }) totalSelect: ElementRef;
  @ViewChild('alertModel', { static: true }) alertModel: ElementRef;
  @ViewChild('navMenuToggleId', { static: true }) navMenuToggleId: ElementRef;

  constructor() {
    this.localItem = localStorage.getItem("notes");

    if (this.localItem == null) {
      this.notes = [];
    } else {
      this.notes = JSON.parse(this.localItem)
    }

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      if (this.notes[i1].delete == true) {
        this.deleted.push(this.notes[i1]);
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

  emptyBin() {

    let objectLength = Object.keys(this.deleted).length;

    if(objectLength>0){

    if (confirm("Are you sure to empty the bin!")) {

      for (let i1 = 0; i1 < this.deleted.length; i1++) {
        for (let j1 = 0; j1 < this.notes.length; j1++) {
          if (this.notes[j1].id == this.deleted[i1].id) {
            this.notes.splice(j1, 1);
            break;
          }
        }
      }

      this.deleted = [];

      console.log(this.notes);
      localStorage.setItem("notes", JSON.stringify(this.notes));

      const alertModel = this.alertModel.nativeElement;
      alertModel.style.opacity = "1";
      alertModel.innerHTML = "<p><strong>Alert: </strong>Empty Bin is done</p>";
      setTimeout(() => {
        alertModel.style.opacity = "0";
      }, 2000);
    }

  }else{
    const alertModel = this.alertModel.nativeElement;
      alertModel.style.opacity = "1";
      alertModel.innerHTML = "<p><strong>Alert: </strong>Bin is already empty</p>";
      setTimeout(() => {
        alertModel.style.opacity = "0";
      }, 2000);
  }

  }

  restoreNotes() {
    const selectedNavbar = this.selectedNavbar.nativeElement;

    for (let key in this.selectObject) {
      for (let i1 = 0; i1 < this.notes.length; i1++) {
        // Search for same note
        if (this.notes[i1].id == parseInt(key)) {
          this.notes[i1].delete = false;
          for (let j1 = 0; j1 < this.deleted.length; j1++) {
            if (this.deleted[j1].id == this.notes[i1].id) {
              this.deleted.splice(j1, 1);
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
    selectedNavbar.style.opacity = "0";
    selectedNavbar.style.height = "0vw";

    const alertModel = this.alertModel.nativeElement;
    alertModel.style.opacity = "1";
    alertModel.innerHTML = "<p><strong>Alert: </strong>Note is restored</p>";
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
          for (let j1 = 0; j1 < this.deleted.length; j1++) {
            if (this.deleted[j1].id == this.notes[i1].id) {
              document.getElementById('notes' + this.deleted[j1].id).style.display = "none";
              break;
            }
          }
          this.notes.splice(i1, 1);
          break;
        }
      }
    }

    localStorage.setItem("notes", JSON.stringify(this.notes));


    this.selectObject = [];
    this.selectedMode = false;
    this.touched = true;
    selectedNavbar.style.opacity = "0";
    selectedNavbar.style.height = "0vw";

    const alertModel = this.alertModel.nativeElement;
    alertModel.style.opacity = "1";
    alertModel.innerHTML = "<p><strong>Alert: </strong>Notes are permanetely deleted</p>";
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
      }

    } else {
      this.holdTimeout = setTimeout(() => {
        if (this.touched) {
          this.selectObject[id] = notes;
          modal.style.border = '3px solid #00668c';
          this.selectedMode = true;
          this.touched = false;
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
