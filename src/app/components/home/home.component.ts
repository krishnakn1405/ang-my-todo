import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { Notes } from 'src/app/notes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  fullWidth: Boolean = false;
  selectObject: Object = [];
  selectedMode: Boolean = false;
  holdTimeout;
  touched: Boolean = true;
  linkClick: Boolean = true;

  id: Number;
  title: String;
  description: String;
  delete: Boolean;

  localItem: string;
  notes: Notes[];
  realNotes: Notes[] = [];
  pinned: Notes[] = [];
  search: Notes[];
  searchStatus: Boolean = false;

  @ViewChild('fullWidthIcon', { static: true }) fullWidthIcon: ElementRef;
  @ViewChild('selectedNavbar', { static: true }) selectedNavbar: ElementRef;
  @ViewChild('totalSelect', { static: true }) totalSelect: ElementRef;
  @ViewChild('alertModel', { static: true }) alertModel: ElementRef;
  @ViewChild('navbar', { static: true }) navbar: ElementRef;
  @ViewChild('NavSpace', { static: true }) NavSpace: ElementRef;
  @ViewChild('navMenuToggleId', { static: true }) navMenuToggleId: ElementRef;

  constructor() {
    this.id = Math.floor(Math.random() * 100000001);

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
      if (this.notes[i1].pin == true && this.notes[i1].delete == false && this.notes[i1].archive == false) {
        this.pinned.push(this.notes[i1]);
      }
    }

    for (let i1 = 0; i1 < this.notes.length; i1++) {
      if (this.notes[i1].pin == false && this.notes[i1].delete == false && this.notes[i1].archive == false) {
        this.realNotes.push(this.notes[i1]);
      }
    }

  }

  ngOnInit(): void {
    this.toggleNavbarPosition();
  }

  prevScrollPos = window.scrollY;


  notesSearch(event) {
    let searchValue = event.target.value;
    this.search = [];
    this.searchStatus = true;

    if (searchValue == '') {
      this.searchStatus = false;
    } else {

      for (let i1 = 0; i1 < this.notes.length; i1++) {
        const currentNote = this.notes[i1];

        if (currentNote.title.includes(searchValue) || currentNote.description.includes(searchValue)) {
          if (!this.search.some(note => note.id === currentNote.id)) {
            this.search.push(currentNote);
          }
        }
      }
    }
  }


  toggleNavbarPosition() {

    const navbar = this.navbar.nativeElement;
    const NavSpace = this.NavSpace.nativeElement;

    if (window.scrollY > 6) {
      navbar.classList.add('fixed');
      NavSpace.style.marginTop = "15vw"

    } else {
      navbar.classList.remove('fixed');
      NavSpace.style.marginTop = "0vw"
    }

  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    let currentScrollPos = window.scrollY;

    if (currentScrollPos < this.prevScrollPos) {
      this.toggleNavbarPosition();
    }

    this.prevScrollPos = currentScrollPos;
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

  pinNotes() {
    const selectedNavbar = this.selectedNavbar.nativeElement;
    let realValue;
    let forRun = false;

    for (let key in this.selectObject) {
      for (let i1 = 0; i1 < this.notes.length; i1++) {
        // Search for same note
        if (this.notes[i1].id == parseInt(key)) {
          if (this.notes[i1].pin == true) {
            this.notes[i1].pin = false;

            if (forRun == false)
              for (let j1 = 0; j1 < this.pinned.length; j1++) {
                if (this.pinned[j1].id == this.notes[i1].id) {
                  this.pinned.splice(j1, 1);
                }
              }
            this.realNotes.push(this.notes[i1]);
            realValue = false;
          } else {
            this.notes[i1].pin = true;
            for (let j1 = 0; j1 < this.realNotes.length; j1++) {
              if (this.realNotes[j1].id == this.notes[i1].id) {
                this.realNotes.splice(j1, 1);
              }
            }
            this.pinned.push(this.notes[i1]);
            realValue = true;
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
    const selectedNavbar = this.selectedNavbar.nativeElement;

    for (let key in this.selectObject) {
      for (let i1 = 0; i1 < this.notes.length; i1++) {
        // Search for same note
        if (this.notes[i1].id == parseInt(key)) {
          this.notes[i1].archive = true;
          for (let j1 = 0; j1 < this.realNotes.length; j1++) {
            if (this.realNotes[j1].id == this.notes[i1].id) {
              this.realNotes.splice(j1, 1);
              break;
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
    alertModel.innerHTML = "<p><strong>Alert: </strong>Note is archived</p>";
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
          for (let j1 = 0; j1 < this.realNotes.length; j1++) {
            if (this.realNotes[j1].id == this.notes[i1].id) {
              this.realNotes.splice(j1, 1);
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
