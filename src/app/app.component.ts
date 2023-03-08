import { Xliff } from '@angular/compiler';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
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
    fields: [
      {
        name: 'role',
        displayName: 'Role',
        value: null,
        dataType: 'STRING',
      },
    ],
  },
];

export const MANAGERS_SELECTED_LINK_ATTRIBUTES = [
  {
    fields: [
      {
        name: 'role',
        displayName: 'Role',
        value: null,
        dataType: 'STRING',
      },
      {
        name: 'text',
        displayName: 'Text Feild',
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
    fields: [
      {
        name: 'role',
        displayName: 'Role',
        value: null,
        dataType: 'STRING',
      },
    ],
  },
];

export const FOOTBALL_CLUBS = [
  {
    id: '123',
    typeName: 'Lion',
    label: ['Aston Villa', '1874'],
    icon: 'Lion',
  },
  {
    id: '456',
    typeName: 'Devil',
    label: ['Manchester United', '1878'],
    icon: 'Devil',
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
  public linkType: any;
  public edit: boolean;
  public fields;
  public checked: boolean;
  get get_linkTypeValue() {
    return this.linkTypeForm.get('EID_linkName');
  }

  public handleSaveLink(): void {
    this.linkTypeForm.get('EID_linkName').patchValue(this.linkType);
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
      EID_linkName: new FormControl('Friends', [Validators.required]),
      fields: this.formBuilder.array([this.createLinkAttributesFormGroup()]),
    });
  }

  private createLinkAttributesFormGroup(): FormGroup {
    this.linkTypeAttributeForm = this.formBuilder.group({});
    return this.linkTypeAttributeForm;
  }

  public handleLinkTypeSelection(linkType) {
    this.linkType = linkType;
    //removes the local storage key for other select options
    localStorage.removeItem('roleValue');
    //resets the checkbox
    this.checked = false;
    // empties control values if the attributes are the same between each select option - rare occasion
    this.linkTypeAttributeForm.reset();
    // removes the controls from form of previous selected option - null anyway but best practice
    // this.linkTypeAttributeForm.controls = {};

    // API CALL MOCK DATA
    let resp = [];
    if (this.linkType === 'Managers') {
      resp = MANAGERS_SELECTED_LINK_ATTRIBUTES;
    } else if (this.linkType === 'Other....') {
      resp = OTHER;
    } else {
      resp = SHARED_PLAYERS_SELECTED_LINK_ATTRIBUTES;
    }

    // Remove controls from group when select changed

    this.fields = resp[0].fields;

    // Adds the fields to the group
    for (let x of resp[0].fields) {
      this.linkTypeAttributeForm.addControl(x.displayName, new FormControl());
    }

    const EID_linkName = this.linkTypeForm.get('EID_linkName').value;
    this.linkTypeForm
      .get('fields')
      ['controls'][0].controls.Role.patchValue(EID_linkName);
    //this.linkTypeForm.get('EID_linkName').patchValue(linkType);
  }

  onEditRole(evt) {
    this.checked = evt.target.checked;
   
    // Adds the original role to storage before amendment
    if (!localStorage['roleValue']) {
      localStorage.setItem(
        'roleValue',
        this.linkTypeForm.get('fields')['controls'][0].controls.Role.value
      );
    }
    this.linkTypeForm.get('fields')['controls'][0].controls.Role.setValue('');
    if (!this.checked) {
      // Gets the original role from storage if the user decides against editing the label
      const getOriginalRoleValue = localStorage.getItem('roleValue');
      this.linkTypeForm
        .get('fields')
        ['controls'][0].controls.Role.setValue(getOriginalRoleValue);
    }
  }

  ngOnInit(): void {
    this.setLinkTypes();
  }
}
