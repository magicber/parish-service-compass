// Field-by-field guidance for the service request form.
// To add or change a service: edit SERVICE_TYPES/SERVICE_LABELS in
// requests.functions.ts, then add a matching entry in SERVICE_GUIDES below.
// Any field a service doesn't override falls back to DEFAULT_FIELD_GUIDES.

export type FieldKey =
  | "serviceType"
  | "fullName"
  | "email"
  | "phone"
  | "preferredDate"
  | "notes";

export interface FieldGuide {
  title: string;
  hint: string;
  example?: string;
  placeholder?: string;
}

export interface ServiceGuide {
  overview: string;
  fields: Partial<Record<FieldKey, FieldGuide>>;
  tips: string[];
}

export const DEFAULT_FIELD_GUIDES: Record<Exclude<FieldKey, "serviceType">, FieldGuide> = {
  fullName: {
    title: "Full name",
    hint: "Use the complete legal name as written on government-issued ID or church records.",
    example: "Maria Luisa Santos-Reyes",
    placeholder: "e.g. Maria Santos",
  },
  email: {
    title: "Email address",
    hint: "This is where the parish office sends the confirmation, schedule and requirements list.",
    example: "you@example.com",
    placeholder: "you@example.com",
  },
  phone: {
    title: "Contact number (optional)",
    hint: "A mobile number lets the office reach you faster for schedule changes.",
    example: "+63 917 123 4567",
    placeholder: "+63 917 000 0000",
  },
  preferredDate: {
    title: "Preferred date (optional)",
    hint: "Pick your first choice — the office confirms final dates since sacraments follow a set calendar.",
  },
  notes: {
    title: "Notes (optional)",
    hint: "Anything the office should know to prepare your request.",
  },
};

export const SERVICE_GUIDES: Record<string, ServiceGuide> = {
  baptism: {
    overview:
      "Baptism is celebrated on scheduled dates after a preparation seminar for parents and godparents.",
    fields: {
      fullName: {
        title: "Full name",
        hint: "Enter the child's full legal name as it appears on the birth certificate.",
        example: "Juan Miguel Dela Cruz",
        placeholder: "Child's full name, e.g. Juan Miguel Dela Cruz",
      },
      email: {
        title: "Email address",
        hint: "Use the email of the parent or guardian who will attend the seminar.",
      },
      preferredDate: {
        title: "Preferred date (optional)",
        hint: "Baptisms are usually held on Sunday mornings after the last Mass.",
      },
      notes: {
        title: "Notes (optional)",
        hint: "Include the child's birth date and the number of godparents (maximum two pairs).",
        placeholder: "e.g. Born June 12, 2024; two godparent pairs; parents attending seminar",
      },
    },
    tips: [
      "Bring the child's birth certificate to the office after submitting.",
      "Godparents must be confirmed Catholic adults; two pairs is the usual limit.",
    ],
  },
  wedding: {
    overview:
      "Weddings require a canonical interview and banns publication, so file your request at least 3 months before the target date.",
    fields: {
      fullName: {
        title: "Full name",
        hint: "Enter the groom's full name, then the bride's, separated by an ampersand.",
        example: "John Reyes & Ana Cruz",
        placeholder: "e.g. John Reyes & Ana Cruz",
      },
      preferredDate: {
        title: "Preferred date (optional)",
        hint: "Weddings are typically scheduled Saturdays; include your preferred time in the notes.",
      },
      notes: {
        title: "Notes (optional)",
        hint: "Add your preferred time, number of principal sponsors, and whether either party was previously married (this requires extra clearance).",
        placeholder: "e.g. 2:00 PM ceremony; 6 principal sponsors; both first marriage",
      },
    },
    tips: [
      "Marriage banns are posted for three consecutive Sundays before the wedding.",
      "If either party was previously married, mention it — a church process is needed first.",
    ],
  },
  funeral: {
    overview:
      "For funerals, the parish coordinates the vigil, requiem Mass and interment with the family.",
    fields: {
      fullName: {
        title: "Full name",
        hint: "Enter the full name of the deceased.",
        example: "Pedro Ramos",
        placeholder: "Name of the deceased, e.g. Pedro Ramos",
      },
      preferredDate: {
        title: "Preferred date (optional)",
        hint: "Give your preferred date for the requiem Mass; the office confirms by phone given wake schedules.",
      },
      notes: {
        title: "Notes (optional)",
        hint: "Include the wake location, preferred Mass time, and the cemetery or columbarium for interment.",
        placeholder: "e.g. Wake at Golden Haven Chapel; 9 AM Mass; interment at Manila Memorial",
      },
    },
    tips: [
      "The parish can prioritize funeral requests — call the office if the schedule is urgent.",
      "Have the death certificate ready; the office will ask for a copy.",
    ],
  },
  blessing: {
    overview:
      "House blessings are done by a priest at your home — give the exact address so travel can be arranged.",
    fields: {
      fullName: {
        title: "Full name",
        hint: "Enter the name of the homeowner or the family head requesting the blessing.",
        example: "Corazon Villanueva",
        placeholder: "e.g. Corazon Villanueva",
      },
      preferredDate: {
        title: "Preferred date (optional)",
        hint: "Blessings are usually scheduled late morning or afternoon; afternoon is popular for house blessings.",
      },
      notes: {
        title: "Notes (optional)",
        hint: "Give the full house address and landmark so the priest can find it easily.",
        placeholder: "e.g. 21 Sampaguita St., Brgy. San Isidro, near the barangay hall",
      },
    },
    tips: [
      "Prepare candles and holy water containers if you'd like them blessed at the same time.",
      "New vehicles and business spaces can also be blessed — mention it in the notes.",
    ],
  },
  first_communion: {
    overview:
      "First Communion is normally given after completing the parish catechism program.",
    fields: {
      fullName: {
        title: "Full name",
        hint: "Enter the full name of the child receiving First Communion.",
        example: "Sofia Marie Aquino",
        placeholder: "Child's full name, e.g. Sofia Marie Aquino",
      },
      notes: {
        title: "Notes (optional)",
        hint: "Include the child's age and whether they are already enrolled in the parish catechism class.",
        placeholder: "e.g. Age 9; enrolled in Sunday catechism at this parish",
      },
    },
    tips: [
      "Children not yet enrolled in catechism are welcome — the office will guide enrollment.",
      "First Communions are usually held as a group ceremony twice a year.",
    ],
  },
  confirmation: {
    overview:
      "Confirmation candidates go through a short formation period before the bishop's or priest's schedule is set.",
    fields: {
      fullName: {
        title: "Full name",
        hint: "Enter the full name of the candidate being confirmed.",
        example: "Gabriel Mendoza",
        placeholder: "Candidate's full name, e.g. Gabriel Mendoza",
      },
      notes: {
        title: "Notes (optional)",
        hint: "Include the candidate's age and the name of the confirmed sponsor (ninong/ninang).",
        placeholder: "e.g. Age 15; sponsor: Elena Mendoza (confirmed, same parish)",
      },
    },
    tips: [
      "The sponsor must be a confirmed Catholic at least 16 years old.",
      "Bring the baptismal certificate — a new one issued within the last 6 months is preferred.",
    ],
  },
  mass_intention: {
    overview:
      "Mass intentions are offered for someone living or deceased during a scheduled Mass.",
    fields: {
      fullName: {
        title: "Full name",
        hint: "Enter the name of the person the Mass is offered for.",
        example: "+ Remedios Garcia (deceased)",
        placeholder: "e.g. Remedios Garcia",
      },
      preferredDate: {
        title: "Preferred date (optional)",
        hint: "Give the date you want the intention read; weekday Masses have more open slots.",
      },
      notes: {
        title: "Notes (optional)",
        hint: "Say whether the person is living or deceased, and which Mass (morning/evening) you prefer.",
        placeholder: "e.g. Deceased mother; morning weekday Mass; thanksgiving for 40th day",
      },
    },
    tips: [
      "Intentions are listed in the bulletin on a first-come, first-served basis.",
      "A customary offering (stipend) is settled at the parish office.",
    ],
  },
};

export function getServiceGuide(serviceType: string): ServiceGuide {
  return SERVICE_GUIDES[serviceType] ?? SERVICE_GUIDES.baptism;
}

export function getFieldGuide(serviceType: string, field: FieldKey): FieldGuide {
  if (field === "serviceType") {
    return {
      title: "Service requested",
      hint: getServiceGuide(serviceType).overview,
    };
  }
  return { ...DEFAULT_FIELD_GUIDES[field], ...getServiceGuide(serviceType).fields[field] };
}

export function getPlaceholder(serviceType: string, field: FieldKey): string | undefined {
  const guide = getFieldGuide(serviceType, field);
  return guide.placeholder ?? DEFAULT_FIELD_GUIDES[field as Exclude<FieldKey, "serviceType">]?.placeholder;
}
