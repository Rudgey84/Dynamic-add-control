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
        name: 'Manager Text Field',
        displayName: 'Manager Text Field',
        value: null,
        dataType: 'STRING',
      },
      {
        name: 'Manager date attribute',
        displayName: 'Manager date attribute',
        value: null,
        dataType: 'DATE',
      },
    ],
  },
];

export const SHARED_PLAYERS_SELECTED_LINK_ATTRIBUTES = [
  {
    fields: [
      {
        name: 'Player text Field',
        displayName: 'Player text Field',
        value: null,
        dataType: 'STRING',
      },
      {
        name: 'Player date attribute',
        displayName: 'Player date attribute',
        value: null,
        dataType: 'DATE',
      },
    ],
  },
];

export const NULLRESPONSE = [
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
    parentLineStyle: "Unconfirmed"
  },
  {
    id: '456',
    typeName: 'Devil',
    label: ['Manchester United', '1878'],
    icon: 'houses-fill',
    parentLineStyle: "Unconfirmed"
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
  @Output() saved = new EventEmitter();
  @Output() editTitle: EventEmitter<any> = new EventEmitter(true);

  public nodeObjects = FOOTBALL_CLUBS;
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
    const linkTypeToRespMap = {
      Managers: MANAGERS_SELECTED_LINK_ATTRIBUTES,
      'Other....': OTHER,
      'Shared Players': SHARED_PLAYERS_SELECTED_LINK_ATTRIBUTES,
      undefined: NULLRESPONSE,
    };
    resp = linkTypeToRespMap[this.selectedLinkType];
    // empties control values if the attributes are the same between each select option - rare occasion
    this.linkTypeAttributeForm.reset();

    // Remove controls from group when select changed
    for (const controlName in this.linkTypeAttributeForm.controls) {
      this.linkTypeAttributeForm.removeControl(controlName);
    }

    this.fields = resp[0].fields;

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
