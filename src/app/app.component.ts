import { Xliff } from '@angular/compiler';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';

// MOCK DATA
export const LINKS = [
  {
    linkName: 'Managers',
    displayName: 'Managers',
    createable: false,
    children: [
      {
        name: 'Friends',
        displayName: 'Friends',
        createable: false,
      },
      {
        name: 'Fierce Rivals',
        displayName: 'Fierce Rivals',
        createable: false,
      },
    ],
  },
  {
    linkName: 'Shared Players',
    displayName: 'Shared Players',
    createable: false,
    children: [
      {
        name: 'Was a player of',
        displayName: 'Was a player of',
        createable: true,
      },
      {
        name: 'Scored against',
        displayName: 'Scored against',
        createable: true,
      },
    ],
  },
  {
    linkName: 'Other....',
    displayName: 'Other....',
    createable: false,
    children: [
      {
        name: 'Label',
        displayName: 'Label',
        createable: true,
      },
    ],
  },
];

export const OTHER = [
  {
    fields: [],
  },
];

export const MANAGERS_SELECTED_LINK_ATTRIBUTES = [
  {
    fields: [
      {
        name: 'text',
        displayName: 'Text Field',
        value: null,
        dataType: 'STRING',
      },
      {
        name: 'Date attribute',
        displayName: 'Date attribute',
        value: null,
        dataType: 'DATE',
      },
    ],
  },
];

export const SHARED_PLAYERS_SELECTED_LINK_ATTRIBUTES = [
  {
    fields: [],
  },
];

export const FOOTBALL_CLUBS = [
  {
    id: '123',
    typeName: 'Lion',
    label: ['Aston Villa', '1874'],
    icon: 'headset',
  },
  {
    id: '456',
    typeName: 'Devil',
    label: ['Manchester United', '1878'],
    icon: 'houses-fill',
  },
];
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  @Input() type: number;
  @Input() urnNumber: string;
  nodeObjects = FOOTBALL_CLUBS;
  @Output() saved = new EventEmitter();
  @Output() editTitle: EventEmitter<any> = new EventEmitter(true);
  // TODO: remove environment when dev complete

  public linkTypeForm: FormGroup;
  public linkTypeAttributeForm: FormGroup;
  public linkTypes: any;
  public edit: boolean;
  public fields;
  public isOtherValueField: boolean;
  public selectedLinkType: any;
  get get_linkTypeValue() {
    return this.linkTypeForm.get('linkName');
  }

  public handleSaveLink(): void {
    this.linkTypeForm.get('linkName').patchValue(this.selectedLinkType);
    console.log('saved', this.linkTypeForm.value);
  }

  // Get all available link types...
  private setLinkTypes(): void {
    this.linkTypes = LINKS;

    this.linkTypeForm = this.initForm();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      leftArrow: new FormControl(),
      rightArrow: new FormControl(),
      linkName: new FormControl('', [Validators.required]),
      fields: this.formBuilder.array([this.createLinkAttributesFormGroup()]),
    });
  }

  private createLinkAttributesFormGroup(): FormGroup {
    this.linkTypeAttributeForm = this.formBuilder.group({});
    return this.linkTypeAttributeForm;
  }

  public handleLinkTypeSelection(event) {
    // Gets the parent group type of the selected link - selectedOptions is not compatible with IE11
    const options = event.srcElement.options;
    const selectedOption = [...options].find((option) => option.selected);

    // Gets the parent group type of the selected link
    this.selectedLinkType = selectedOption.parentNode.label;

    // Set hardcoded other field to false - set to true if selected to show other input
    this.isOtherValueField = false;
    if (selectedOption.id === this.selectedLinkType) {
      this.isOtherValueField = true;
    }

    // API CALL MOCK DATA
    let resp = [];
    if (this.selectedLinkType === 'Managers') {
      resp = MANAGERS_SELECTED_LINK_ATTRIBUTES;
    } else if (this.selectedLinkType === 'Other....') {
      resp = OTHER;
    } else {
      //   resp = SHARED_PLAYERS_SELECTED_LINK_ATTRIBUTES;
      resp = null;
    }
    // empties control values if the attributes are the same between each select option - rare occasion
    this.linkTypeAttributeForm.reset();

    // Remove controls from group when select changed
    for (const controlName in this.linkTypeAttributeForm.controls) {
      this.linkTypeAttributeForm.removeControl(controlName);
    }

    if (resp) {
      this.fields = resp[0].fields;
    } else {
      this.fields = [{}];
    }

    // Adds the fields to the group
    for (let x of this.fields) {
      this.linkTypeAttributeForm.addControl(x.name, new FormControl());
    }
    this.linkTypeAttributeForm.addControl('role', new FormControl());

    const linkName = this.linkTypeForm.get('linkName').value;
    if (!this.isOtherValueField) {
      this.linkTypeForm
        .get('fields')
        ['controls'][0].controls.role.patchValue(linkName);
    }
  }

  ngOnInit(): void {
    this.setLinkTypes();
  }
}
