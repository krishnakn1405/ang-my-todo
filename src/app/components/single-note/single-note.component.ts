import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Notes } from 'src/app/notes';

@Component({
  selector: 'app-single-note',
  templateUrl: './single-note.component.html',
  styleUrls: ['./single-note.component.css']
})
export class SingleNoteComponent implements OnInit {

  id: Number;
  title: String;
  description: String;
  date: Date;
  archive: Boolean;
  delete: Boolean;
  pin: Boolean;

  isThere: boolean = false;

  localItem: string;
  notes: Notes[];

  constructor(private route: ActivatedRoute, private router: Router) {
    route.queryParams.subscribe(val => {
      this.id = val.id;
    });

    this.localItem = localStorage.getItem("notes");
    if (this.localItem == null) {
      this.notes = [];
    } else {
      this.notes = JSON.parse(this.localItem)
    }

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      // Delete empty notes
      if (this.notes[i1].title == '' && this.notes[i1].description == '') {
        this.notes.splice(i1, 1);
        localStorage.setItem("notes", JSON.stringify(this.notes));
      }
    }

    for (let i1 = 0; i1 < this.notes.length; i1++) {

      // Search for same note
      if (this.notes[i1].id == this.id && this.notes[i1].delete== false) {
        this.title = this.notes[i1].title;
        this.description = this.notes[i1].description;
        this.date = this.notes[i1].date;
        this.archive = this.notes[i1].archive;
        this.delete = this.notes[i1].delete;
        this.pin = this.notes[i1].pin;

        this.isThere = true;
        break;
      }

    }

  }

  ngOnInit(): void {
    if (this.isThere == false) {
      this.title = '';
      this.description = '';
      this.date = new Date();
      this.archive = false;
      this.delete = false;
      this.pin = false;

      const note = {
        id: this.id,
        title: this.title,
        description: this.description,
        date: this.date,
        archive: this.archive,
        delete: this.delete,
        pin: this.pin
      }

      this.notes.push(note);

      localStorage.setItem("notes", JSON.stringify(this.notes))
    }

  }

  @ViewChild('alertModel', { static: true }) alertModel: ElementRef;
  @ViewChild('editableHeading', { static: true }) editableHeading: ElementRef;

  pinNotes() {

    let realValue;

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      // Update note
      if (this.notes[i1].id == this.id) {
        if (this.notes[i1].pin == true) {
          this.notes[i1].pin = false;
          realValue = false;
        } else {
          this.notes[i1].pin = true;
          realValue = true;
        }
      }
    }
    localStorage.setItem("notes", JSON.stringify(this.notes));

    const alertModel = this.alertModel.nativeElement;
    alertModel.style.opacity = "1";
    if (realValue == true) {
      alertModel.innerHTML = "<p><strong>Alert: </strong>Note is pinned</p>";
    } else {
      alertModel.innerHTML = "<p><strong>Alert: </strong>Note is unpinned</p>";
    }
    setTimeout(() => {
      alertModel.style.opacity = "0";
    }, 2000);

  }

  archiveNotes() {
    let realValue;

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      // Update note
      if (this.notes[i1].id == this.id) {
        if (this.notes[i1].archive == true) {
          this.notes[i1].archive = false;
          realValue = false;
        } else {
          this.notes[i1].archive = true;
          realValue = true;
        }
      }
    }
    localStorage.setItem("notes", JSON.stringify(this.notes));

    const alertModel = this.alertModel.nativeElement;
    alertModel.style.opacity = "1";
    if (realValue == true) {
      alertModel.innerHTML = "<p><strong>Alert: </strong>Note is archived</p>";
    } else {
      alertModel.innerHTML = "<p><strong>Alert: </strong>Note is unarchived</p>";
    }
    setTimeout(() => {
      alertModel.style.opacity = "0";
    }, 2000);

  }

  deleteNotes() {
    for (let i1 = 0; i1 < this.notes.length; i1++) {
      // Update note
      if (this.notes[i1].id == this.id) {
        if (this.notes[i1].delete == false) {
          this.notes[i1].delete = true;
        }
      }
    }
    localStorage.setItem("notes", JSON.stringify(this.notes));

    const alertModel = this.alertModel.nativeElement;
    alertModel.style.opacity = "1";
    alertModel.innerHTML = "<p><strong>Alert: </strong>Note moved to bin</p>";
    setTimeout(() => {
      alertModel.style.opacity = "0";
      this.router.navigate(['/']);
    }, 2000);

  }

  notesTitleUpdate(event) {
    let title = event.target.value;

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      // Update note
      if (this.notes[i1].id == this.id) {
        this.notes[i1].title = title;
      }
    }
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  notesDescriptionUpdate(event) {
    let description = event.target.value;

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      // Update note
      if (this.notes[i1].id == this.id) {
        this.notes[i1].description = description;
      }
    }
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

}
