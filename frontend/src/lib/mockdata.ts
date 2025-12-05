import { Lead } from "./mocktypes";
import { Application } from "@/stores/useApplicationStore";

export const courses = [
    {
        id: 1,
        title: "Masters in Management and Production Engineering - Transport management and logistics",
        university: "University of Ecology and Management (UEM), Warsaw, Poland",
        duration: "24 Months",
        fee: "4000 PLN",
        intake: "Sep",
        level: "Masters",
        appFee: "N/A",
        logoUrl: "https://placehold.co/100x100/E2F0D9/3E5F2A?text=UEM"
    },
    {
        id: 2,
        title: "Masters in Management and Production Engineering - Management of production company",
        university: "University of Ecology and Management (UEM), Warsaw, Poland",
        duration: "24 Months",
        fee: "4000 PLN",
        intake: "Sep",
        level: "Masters",
        appFee: "N/A",
        logoUrl: "https://placehold.co/100x100/E2F0D9/3E5F2A?text=UEM"
    },
    {
        id: 3,
        title: "Masters in Management - Marketing and PR",
        university: "University of Ecology and Management (UEM), Warsaw, Poland",
        duration: "24 Months",
        fee: "3700 PLN",
        intake: "Sep | Mar",
        level: "Masters",
        appFee: "N/A",
        logoUrl: "https://placehold.co/100x100/E2F0D9/3E5F2A?text=UEM"
    },
    {
        id: 4,
        title: "Bachelor of Science in Computer Science",
        university: "Stanford University, California, USA",
        duration: "4 Years",
        fee: "$55,000 USD",
        intake: "Fall",
        level: "Bachelors",
        appFee: "$90 USD",
        logoUrl: "https://placehold.co/100x100/B40404/FFFFFF?text=SU"
    },
    {
        id: 5,
        title: "Master of Business Administration (MBA)",
        university: "London Business School, London, UK",
        duration: "15 Months",
        fee: "£97,500 GBP",
        intake: "Aug",
        level: "Masters",
        appFee: "£200 GBP",
        logoUrl: "https://placehold.co/100x100/002147/FFFFFF?text=LBS"
    },
    {
        id: 6,
        title: "PhD in Theoretical Physics",
        university: "Technical University of Munich, Munich, Germany",
        duration: "3-4 Years",
        fee: "€0 EUR",
        intake: "Oct | Apr",
        level: "PhD",
        appFee: "Free",
        logoUrl: "https://placehold.co/100x100/3070B3/FFFFFF?text=TUM"
    },
    {
        id: 7,
        title: "Diploma in Digital Marketing",
        university: "Centennial College, Toronto, Canada",
        duration: "1 Year",
        fee: "$17,000 CAD",
        intake: "Jan | May",
        level: "Diploma",
        appFee: "$100 CAD",
        logoUrl: "https://placehold.co/100x100/006442/FFFFFF?text=CC"
    },
    {
        id: 8,
        title: "Bachelor of Nursing",
        university: "University of Sydney, Sydney, Australia",
        duration: "3 Years",
        fee: "$45,000 AUD",
        intake: "Feb",
        level: "Bachelors",
        appFee: "$150 AUD",
        logoUrl: "https://placehold.co/100x100/D71920/FFFFFF?text=USYD"
    },
    {
        id: 9,
        title: "Master of Technology in Data Science",
        university: "Indian Institute of Technology Bombay (IITB), Mumbai, India",
        duration: "2 Years",
        fee: "₹2,28,000 INR",
        intake: "Jul",
        level: "Masters",
        appFee: "₹600 INR",
        logoUrl: "https://placehold.co/100x100/18453B/FFFFFF?text=IITB"
    },
];

export const filterData = [
  {
    id: "countries",
    name: "Countries",
    options: ["Poland", "Denmark", "USA", "Latvia", "Finland", "Germany", "Sweden"],
  },
  {
    id: "universities",
    name: "Universities",
    options: ["Aalborg University", "Karelia UAS", "Haaga-Helia", "LUT University", "SAMK", "Tampere University"],
  },
  {
    id: "levels",
    name: "Course Levels",
    options: ["Bachelors", "Masters", "PhD", "Associate Degree"],
  },
  {
    id: "intakes",
    name: "Course Intakes",
    options: ["January", "February", "March", "September", "October"],
  },
];


export const leadsData: Lead[] = [
    {
        id: '1',
        serial: '00101355',
        date: '5 Sep 2025',
        time: '1:18 PM',
        name: 'Sandhia Shrestha',
        phone: '+9779863759356',
        branch: 'Kathmandu',
        leadManager: 'Govinda Raj Bisural',
        leadSource: 'QR',
        country: 'Finland',
        status: 'New',
        starred: true
    },
    {
        id: '2',
        serial: '00101354',
        date: '5 Sep 2025',
        time: '12:44 PM',
        name: 'Nabin Gautam',
        phone: '+9779849596136',
        branch: 'Kathmandu',
        leadManager: 'Shiva Pradhan',
        leadSource: 'QR',
        country: 'Finland',
        status: 'New',
        starred: false
    },
    {
        id: '3',
        serial: '00101353',
        date: '5 Sep 2025',
        time: '12:29 PM',
        name: 'Madhu Chaudhary',
        phone: '+9779805027294',
        branch: 'Kathmandu',
        leadManager: 'Govinda Raj Bisural',
        leadSource: 'QR',
        country: 'Europe',
        status: 'New',
        starred: false
    },
    {
        id: '4',
        serial: '00101352',
        date: '4 Sep 2025',
        time: '3:53 PM',
        name: 'Jamuna Khadka',
        phone: '+9779862917863',
        branch: 'Kathmandu',
        leadManager: 'Rashmi Bhatta',
        leadSource: 'QR',
        country: 'Spain',
        status: 'New',
        starred: true
    },
    {
        id: '5',
        serial: '00101351',
        date: '4 Sep 2025',
        time: '1:13 PM',
        name: 'Sharmila Rai',
        phone: '+9779810595813',
        branch: 'Kathmandu',
        leadManager: 'Rashmi Bhatta',
        leadSource: 'QR',
        country: 'Spain',
        status: 'New',
        starred: false
    },
    {
        id: '6',
        serial: '00101356',
        date: '3 Sep 2025',
        time: '11:20 AM',
        name: 'Pema Lama',
        phone: '+9779801234567',
        branch: 'Pokhara',
        leadManager: 'Govinda Raj Bisural',
        leadSource: 'Web',
        country: 'Finland',
        status: 'Lead In Process',
        starred: true
    },
    {
        id: '7',
        serial: '00101357',
        date: '3 Sep 2025',
        time: '9:55 AM',
        name: 'Ashish Thapa',
        phone: '+9779812345678',
        branch: 'Butwal',
        leadManager: 'Shiva Pradhan',
        leadSource: 'Referral',
        country: 'Europe',
        status: 'Assigned',
        starred: false
    },
    {
        id: '8',
        serial: '00101358',
        date: '2 Sep 2025',
        time: '4:12 PM',
        name: 'Sita Karki',
        phone: '+9779845123478',
        branch: 'Lalitpur',
        leadManager: 'Rashmi Bhatta',
        leadSource: 'QR',
        country: 'Spain',
        status: 'Rejected',
        starred: false
    },
    {
        id: '9',
        serial: '00101359',
        date: '2 Sep 2025',
        time: '2:43 PM',
        name: 'Ram Prasad',
        phone: '+9779810000000',
        branch: 'Pokhara',
        leadManager: 'Govinda Raj Bisural',
        leadSource: 'QR',
        country: 'Finland',
        status: 'Cold',
        starred: true
    },
    {
        id: '10',
        serial: '00101360',
        date: '1 Sep 2025',
        time: '10:10 AM',
        name: 'Anjali Shrestha',
        phone: '+9779849000000',
        branch: 'Kathmandu',
        leadManager: 'Shiva Pradhan',
        leadSource: 'Web',
        country: 'Europe',
        status: 'Assigned',
        starred: false
    }
];

export const mockApplications: Application[] = [
  {
    id: "app_001",
    lead_id: "lead_001",
    student_id: "stu_001",
    given_name: "Rahul",
    surname: "Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    application_stage: "submitted",
    created_at: "2024-09-10T10:00:00Z",

    preferences: [
      {
        id: "pref_001",
        application_id: "app_001",
        preferred_country: "Canada",
        preferred_course_name: "Computer Science",
        preferred_course_type: "Bachelors",
      },
    ],

    visa_details: [
      {
        id: "visa_001",
        application_id: "app_001",
        visa_status: "approved",
      },
    ],
  },

  {
    id: "app_002",
    lead_id: "lead_002",
    student_id: "stu_002",
    given_name: "Anjali",
    surname: "Verma",
    email: "anjali@example.com",
    phone: "9123456780",
    application_stage: "in_review",
    created_at: "2024-09-12T14:30:00Z",

    preferences: [
      {
        id: "pref_002",
        application_id: "app_002",
        preferred_country: "UK",
        preferred_course_name: "Business Management",
      },
    ],

    visa_details: [
      {
        id: "visa_002",
        application_id: "app_002",
        visa_status: "pending",
      },
    ],
  },

  {
    id: "app_003",
    lead_id: "lead_003",
    student_id: "stu_003",
    given_name: "Aarav",
    surname: "Singh",
    email: "aarav@example.com",
    phone: "9823456710",
    application_stage: "draft",
    created_at: "2024-09-15T09:20:00Z",

    preferences: [
      {
        id: "pref_003",
        application_id: "app_003",
        preferred_country: "Australia",
        preferred_course_name: "Mechanical Engineering",
      },
    ],

    visa_details: [
      {
        id: "visa_003",
        application_id: "app_003",
        visa_status: "not_applied",
      },
    ],
  },

  {
    id: "app_004",
    lead_id: "lead_004",
    student_id: "stu_004",
    given_name: "Simran",
    surname: "Kaur",
    email: "simran@example.com",
    phone: "9800012345",
    application_stage: "submitted",
    created_at: "2024-09-18T16:00:00Z",

    preferences: [
      {
        id: "pref_004",
        application_id: "app_004",
        preferred_country: "Canada",
        preferred_course_name: "Data Science",
      },
    ],

    visa_details: [
      {
        id: "visa_004",
        application_id: "app_004",
        visa_status: "rejected",
      },
    ],
  },

  {
    id: "app_005",
    lead_id: "lead_005",
    student_id: "stu_005",
    given_name: "Vikas",
    surname: "Mishra",
    email: "vikas@example.com",
    phone: "9753102468",
    application_stage: "in_review",
    created_at: "2024-09-21T11:45:00Z",

    preferences: [
      {
        id: "pref_005",
        application_id: "app_005",
        preferred_country: "USA",
        preferred_course_name: "MBA",
      },
    ],

    visa_details: [
      {
        id: "visa_005",
        application_id: "app_005",
        visa_status: "pending",
      },
    ],
  },
];
