import { PrismaClient, LeadStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing records in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.projectSubmission.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.project.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();

  // 1. Create Default Users (Admin, Instructors for CS & IT, Students across Departments)
  const passwordHashAdmin = await bcrypt.hash("AdminPassword123!", 10);
  const passwordHashSahilAdmin = await bcrypt.hash("Sahil@2004", 10);
  const passwordHashInstructor = await bcrypt.hash("InstructorPassword123!", 10);
  const passwordHashStudent = await bcrypt.hash("StudentPassword123!", 10);

  // Admin 1
  const admin = await prisma.user.create({
    data: {
      email: "admin@careertransformer.in",
      passwordHash: passwordHashAdmin,
      role: "ADMIN",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Aditi Sharma",
          phone: "+91 98765 43210",
          department: "Computer Engineering",
          departmentId: "COMP_ENG",
          education: "B.Tech Computer Science & MBA",
          city: "Bengaluru",
          careerGoal: "Platform Leadership & Student Career Success",
          bio: "Program Director at Career Transformer with 10+ years in Analytics & EdTech leadership.",
        },
      },
    },
  });

  // Admin 2 (Sahil Pawase)
  const sahilAdmin = await prisma.user.create({
    data: {
      email: "pawasesahil2004@gmail.com",
      passwordHash: passwordHashSahilAdmin,
      role: "ADMIN",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Sahil Pawase",
          phone: "+91 96999 82137",
          department: "Computer Engineering",
          departmentId: "COMP_ENG",
          education: "B.E. Computer Engineering",
          city: "Pune",
          careerGoal: "Platform Super Admin & Data Analytics Lead",
          bio: "Super Admin & Creator of Career Transformer Platform.",
        },
      },
    },
  });

  // Host 1: Rahul (Computer Engineering)
  const instructor = await prisma.user.create({
    data: {
      email: "instructor@careertransformer.in",
      passwordHash: passwordHashInstructor,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Rahul Verma",
          phone: "+91 98111 22334",
          department: "Computer Engineering",
          departmentId: "COMP_ENG",
          education: "M.S. in Data Analytics",
          city: "Hyderabad",
          careerGoal: "Mentoring Next-Gen Data Analysts",
          bio: "Lead Analytics Mentor with 8+ years hands-on experience in SQL, Python, and Power BI.",
        },
      },
    },
  });

  // Host 2: Pooja (Information Technology)
  const instructorIT = await prisma.user.create({
    data: {
      email: "pooja.it@careertransformer.in",
      passwordHash: passwordHashInstructor,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Pooja Iyer",
          phone: "+91 98333 44556",
          department: "Information Technology",
          departmentId: "IT",
          education: "M.Tech in Information Technology",
          city: "Bengaluru",
          careerGoal: "Cloud Architecture & Fullstack Engineering",
          bio: "Senior IT Architect and Cloud Instructor.",
        },
      },
    },
  });

  // Student 1: Sahil (Computer Engineering) -> Should receive CS notifications
  const studentSahil = await prisma.user.create({
    data: {
      email: "pawasesahil2@gmail.com",
      passwordHash: passwordHashStudent,
      role: "STUDENT",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Sahil Pawase",
          phone: "+91 96999 82137",
          department: "Computer Engineering",
          departmentId: "COMP_ENG",
          education: "B.E. Computer Engineering",
          college: "Pune University",
          gradYear: "2024",
          experience: "Fresher / Looking for 1st Job",
          city: "Pune",
          careerGoal: "Full-Time Data Analytics Engineer",
          bio: "Enthusiastic CS student mastering SQL and Power BI.",
        },
      },
    },
  });

  // Student 2: Amit (Computer Engineering) -> Should receive CS notifications
  const studentAmit = await prisma.user.create({
    data: {
      email: "amit.cs@careertransformer.in",
      passwordHash: passwordHashStudent,
      role: "STUDENT",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Amit Kumar",
          phone: "+91 98444 55667",
          department: "Computer Engineering",
          departmentId: "COMP_ENG",
          education: "B.Tech Computer Science",
          college: "IIT / NIT",
          gradYear: "2024",
          experience: "Fresher / Looking for 1st Job",
          city: "Delhi NCR",
          careerGoal: "Data Analyst & Database Developer",
        },
      },
    },
  });

  // Student 3: Priya (Mechanical Engineering) -> Must NOT receive CS or IT notifications
  const studentPriya = await prisma.user.create({
    data: {
      email: "priya.mech@careertransformer.in",
      passwordHash: passwordHashStudent,
      role: "STUDENT",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Priya Sharma",
          phone: "+91 98555 66778",
          department: "Mechanical Engineering",
          departmentId: "MECH_ENG",
          education: "B.E. Mechanical Engineering",
          college: "Mumbai University",
          gradYear: "2023",
          experience: "1-2 Years (Junior / Switching)",
          city: "Mumbai",
          careerGoal: "Transitioning from Mechanical CAD to Business Analytics",
        },
      },
    },
  });

  // Student 4: Rohit (Information Technology) -> Should receive IT notifications, but NOT CS notifications
  const studentRohit = await prisma.user.create({
    data: {
      email: "rohit.it@careertransformer.in",
      passwordHash: passwordHashStudent,
      role: "STUDENT",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Rohit Singh",
          phone: "+91 98666 77889",
          department: "Information Technology",
          departmentId: "IT",
          education: "B.Tech Information Technology",
          college: "Anna University",
          gradYear: "2024",
          experience: "Fresher / Looking for 1st Job",
          city: "Chennai",
          careerGoal: "Fullstack BI & Cloud Analytics",
        },
      },
    },
  });

  // Student 5: Default student (Aarav Patel - Computer Engineering)
  const student = await prisma.user.create({
    data: {
      email: "student@careertransformer.in",
      passwordHash: passwordHashStudent,
      role: "STUDENT",
      status: "ACTIVE",
      profile: {
        create: {
          fullName: "Aarav Patel",
          phone: "+91 98222 33445",
          department: "Computer Engineering",
          departmentId: "COMP_ENG",
          education: "B.Tech Computer Science",
          college: "Delhi University",
          gradYear: "2024",
          experience: "0-1 Years (Fresher / Switcher)",
          city: "Delhi NCR",
          careerGoal: "Become a Full-Time Data Analyst in a high-growth company",
          bio: "Enthusiastic learner transforming skills in SQL, Excel, and Power BI.",
        },
      },
    },
  });

  console.log("✅ Users created across departments (CS, IT, MECH)");

  // 2. Create Flagship Course: Data Analytics Career Program
  const course = await prisma.course.create({
    data: {
      slug: "data-analytics",
      title: "Data Analytics Career Program",
      tagline: "Master Excel, SQL, Power BI, Tableau, Python & Business Statistics",
      description:
        "A structured, end-to-end career transformation program built for aspiring Data Analysts, Business Analysts, and BI Engineers. Work on real datasets, build 6 industry portfolio projects, and prepare for interviews with personalized mentor guidance.",
      overview:
        "Designed by senior industry practitioners, this program takes you from foundational spreadsheets to advanced database querying, business intelligence storytelling, and Python data pipelines. Includes 1-on-1 portfolio reviews and mock interview preparation.",
      skills: "Excel, SQL, Power BI, Tableau, Python, Statistics, Business Analytics, Data Storytelling",
      originalPrice: 45000,
      currentPrice: 24999,
      duration: "16 Weeks (Live Mentorship + Self-Paced)",
      level: "Beginner to Career-Ready",
      isPublished: true,
      isFeatured: true,
      prerequisites: "No prior coding or technical background required. Just basic computer literacy and dedication.",
      whoIsThisFor: "College students, fresh graduates, working professionals seeking career pivot, and anyone wanting high-demand analytical roles.",
      syllabusUrl: "/downloads/career-transformer-data-analytics-syllabus.pdf",
    },
  });

  console.log("✅ Course created: Data Analytics Career Program");

  // 3. Create 6 Comprehensive Modules & Lessons
  const modulesData = [
    {
      title: "Module 1: Advanced Excel & Business Data Modeling",
      description: "Master formula logic, dynamic arrays, Power Query automation, and executive dashboards in Excel.",
      orderIndex: 1,
      skillsLearned: "Excel Formulas, XLOOKUP, INDEX-MATCH, Pivot Tables, Power Query, Financial Models",
      lessons: [
        {
          title: "Introduction to Business Spreadsheets & Data Cleansing",
          summary: "Learn best practices for structuring clean tabular data, handling messy imports, and formatting for business readability.",
          durationMinutes: 25,
          orderIndex: 1,
          isFreePreview: true,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Clean data is the bedrock of business analysis. In this lesson, we master text manipulation functions (TRIM, PROPER, TEXTSPLIT), remove duplicates, handle missing values, and structure tables according to Kimball relational conventions.",
          resources: [
            { title: "Raw Sales Import Dataset (.xlsx)", fileUrl: "/resources/excel-mod1-dataset.xlsx", resourceType: "DATASET", fileSize: "1.4 MB" },
            { title: "Excel Keyboard Shortcuts Cheat Sheet (.pdf)", fileUrl: "/resources/excel-shortcuts.pdf", resourceType: "CHEATSHEET", fileSize: "450 KB" },
          ],
        },
        {
          title: "Advanced Lookup Mastery: XLOOKUP, INDEX & MATCH",
          summary: "Move beyond VLOOKUP. Build resilient multi-criteria lookups, 2D matrix lookups, and error-tolerant queries.",
          durationMinutes: 35,
          orderIndex: 2,
          isFreePreview: true,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Explore why INDEX-MATCH and modern XLOOKUP prevent formula breakage during column insertions and how to handle wildcards and approximate lookups for tiered commission modeling.",
          resources: [
            { title: "Lookup Functions Exercise Workbook (.xlsx)", fileUrl: "/resources/lookup-exercises.xlsx", resourceType: "DATASET", fileSize: "820 KB" },
          ],
        },
        {
          title: "Automated ETL with Power Query in Excel",
          summary: "Extract, transform, and load messy multi-sheet files with zero manual copy-pasting.",
          durationMinutes: 40,
          orderIndex: 3,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Learn unpivoting columns, conditional transformations, merging disparate tables, and establishing repeatable refresh pipelines directly inside Excel.",
          resources: [
            { title: "Multi-Region Sales Files (.zip)", fileUrl: "/resources/power-query-files.zip", resourceType: "DATASET", fileSize: "3.2 MB" },
          ],
        },
        {
          title: "Dynamic Pivot Tables, Slicers & Calculated Fields",
          summary: "Transform raw millions of rows into interactive executive summary pivots with timeline filters.",
          durationMinutes: 30,
          orderIndex: 4,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Master grouping date hierarchies, year-over-year growth calculations, Pareto 80/20 analysis, and linked slicer dashboards.",
          resources: [
            { title: "Executive Pivot Template (.xlsx)", fileUrl: "/resources/pivot-template.xlsx", resourceType: "CODE", fileSize: "1.1 MB" },
          ],
        },
      ],
      assignment: {
        title: "Assignment 1: Retail Chain Revenue & Profitability Model",
        description: "Ingest multi-store retail data, build Power Query automation, compute KPI metrics (Gross Margin, Return Rates, Store Efficiency), and design an interactive executive tab.",
        totalMarks: 100,
        orderIndex: 1,
      },
    },
    {
      title: "Module 2: SQL for Analytics & Data Warehousing",
      description: "From basic SELECT statements to advanced window functions, CTEs, and query optimization on PostgreSQL/Snowflake.",
      orderIndex: 2,
      skillsLearned: "SQL, PostgreSQL, Joins, Window Functions, CTEs, Subqueries, Query Optimization",
      lessons: [
        {
          title: "Relational Database Architecture & SQL Fundamentals",
          summary: "Understand tables, primary/foreign keys, normalization, and core SELECT, WHERE, ORDER BY clauses.",
          durationMinutes: 30,
          orderIndex: 1,
          isFreePreview: true,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Understanding relational databases: entities, relationships, constraints, and writing clean, readable standard ANSI SQL queries.",
          resources: [
            { title: "E-Commerce Database Schema DDL (.sql)", fileUrl: "/resources/ecommerce-schema.sql", resourceType: "CODE", fileSize: "12 KB" },
          ],
        },
        {
          title: "Complex Joins, Unions & Data Aggregations",
          summary: "Master INNER, LEFT, RIGHT, FULL OUTER joins, self-joins, GROUP BY, and HAVING filters for business questions.",
          durationMinutes: 45,
          orderIndex: 2,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Discover how to prevent unintended cartesian products, aggregate across joined dimensions, and answer questions like 'Which customers churned after their first order?'.",
          resources: [
            { title: "SQL Joins Visual Guide & Practice (.sql)", fileUrl: "/resources/sql-joins-practice.sql", resourceType: "CODE", fileSize: "18 KB" },
          ],
        },
        {
          title: "Advanced Window Functions (RANK, DENSE_RANK, LEAD, LAG)",
          summary: "Compute running totals, moving averages, top-N per category, and time-based delta calculations.",
          durationMinutes: 50,
          orderIndex: 3,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Window functions are the #1 interview topic for Data Analysts. We deep dive into OVER (PARTITION BY ... ORDER BY ...), framing clauses (ROWS BETWEEN), and month-over-month growth.",
          resources: [
            { title: "Window Functions Masterclass Scripts (.sql)", fileUrl: "/resources/window-functions.sql", resourceType: "CODE", fileSize: "25 KB" },
          ],
        },
        {
          title: "Common Table Expressions (CTEs) & Subqueries",
          summary: "Write modular, readable SQL using WITH clauses and temporary analytical staging queries.",
          durationMinutes: 40,
          orderIndex: 4,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Break down multi-step enterprise queries into clean CTEs, recursive queries for organizational hierarchies, and execution plan inspection.",
          resources: [
            { title: "CTE Practice Problems (.sql)", fileUrl: "/resources/cte-practice.sql", resourceType: "CODE", fileSize: "15 KB" },
          ],
        },
      ],
      assignment: {
        title: "Assignment 2: E-Commerce Customer Cohort Retention Analysis",
        description: "Write SQL queries using window functions and CTEs to compute monthly user retention cohorts, average order value progression, and customer lifetime value (LTV).",
        totalMarks: 100,
        orderIndex: 2,
      },
    },
    {
      title: "Module 3: Power BI — Enterprise Business Intelligence",
      description: "Build robust data models, master DAX measures, configure Row-Level Security, and craft C-level interactive reports.",
      orderIndex: 3,
      skillsLearned: "Power BI Desktop, Star Schema, DAX, Time Intelligence, Custom Tooltips, Power BI Service",
      lessons: [
        {
          title: "Data Modeling Fundamentals: Star Schema vs Snowflake",
          summary: "Learn fact vs dimension tables, relationship cardinality (1-to-many), and cross-filter directions.",
          durationMinutes: 35,
          orderIndex: 1,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Avoid bi-directional relationship pitfalls. Learn why a pristine Kimball star schema yields the fastest DAX evaluation speeds.",
          resources: [
            { title: "Supply Chain Star Schema Data (.pbix)", fileUrl: "/resources/supply-chain-model.pbix", resourceType: "DATASET", fileSize: "5.4 MB" },
          ],
        },
        {
          title: "DAX Mastery: CALCULATE, FILTER & Time Intelligence",
          summary: "Understand row context vs filter context, context transition, and Year-to-Date (YTD) measures.",
          durationMinutes: 55,
          orderIndex: 2,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Master the most powerful DAX function: CALCULATE(). Implement SAMEPERIODLASTYEAR, DATEADD, and dynamic ranking measures.",
          resources: [
            { title: "Top 25 DAX Formulas Handbook (.pdf)", fileUrl: "/resources/dax-handbook.pdf", resourceType: "CHEATSHEET", fileSize: "600 KB" },
          ],
        },
        {
          title: "Executive UI/UX Design for Business Dashboards",
          summary: "Color theory, visual hierarchy, page navigation bookmarks, and accessible KPI cards.",
          durationMinutes: 40,
          orderIndex: 3,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Learn how to build clean, uncluttered dashboards that executives actually love using, with drill-through pages and custom tooltips.",
          resources: [
            { title: "Power BI Visual Theme JSON (.json)", fileUrl: "/resources/custom-theme.json", resourceType: "CODE", fileSize: "5 KB" },
          ],
        },
      ],
      assignment: {
        title: "Assignment 3: SaaS Executive KPI Scorecard",
        description: "Construct a complete Power BI dashboard tracking Monthly Recurring Revenue (MRR), Churn Rate, Customer Acquisition Cost (CAC), and LTV with dynamic date slicing.",
        totalMarks: 100,
        orderIndex: 3,
      },
    },
    {
      title: "Module 4: Tableau — Visual Data Discovery & Storytelling",
      description: "Harness Tableau's visual analytics engine, calculated fields, Level of Detail (LOD) expressions, and storytelling flows.",
      orderIndex: 4,
      skillsLearned: "Tableau Desktop, LOD Expressions (FIXED, INCLUDE, EXCLUDE), Dual-Axis Charts, Story Points",
      lessons: [
        {
          title: "Dimensions, Measures & Tableau Visual Grammar",
          summary: "Master continuous vs discrete fields, chart selection rules, and geospatial mapping.",
          durationMinutes: 30,
          orderIndex: 1,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Green vs blue pills explained. Building bullet graphs, dual-axis bar and line combos, and spatial polygon maps.",
          resources: [
            { title: "Global Healthcare Sample Data (.hyper)", fileUrl: "/resources/healthcare.hyper", resourceType: "DATASET", fileSize: "2.1 MB" },
          ],
        },
        {
          title: "Level of Detail (LOD) Calculations Demystified",
          summary: "Write FIXED, INCLUDE, and EXCLUDE expressions for complex cohort benchmarks.",
          durationMinutes: 45,
          orderIndex: 2,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Calculate customer first purchase date, baseline market comparisons, and regional averages independent of visualization view level.",
          resources: [
            { title: "Tableau LOD Workbook (.twbx)", fileUrl: "/resources/lod-examples.twbx", resourceType: "DATASET", fileSize: "4.8 MB" },
          ],
        },
      ],
    },
    {
      title: "Module 5: Python for Data Analysis & Automation",
      description: "Harness Pandas, NumPy, Seaborn, and Jupyter notebooks to automate data wrangling and exploratory data analysis (EDA).",
      orderIndex: 5,
      skillsLearned: "Python, Pandas, NumPy, Matplotlib, Seaborn, Jupyter, Exploratory Data Analysis (EDA)",
      lessons: [
        {
          title: "Python Data Structures & Environment Setup",
          summary: "Jupyter notebooks, lists, dictionaries, list comprehensions, and control flow for data workflows.",
          durationMinutes: 35,
          orderIndex: 1,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Setting up Anaconda/VSCode, understanding Python data types, writing clean functions, and importing third-party analytics libraries.",
          resources: [
            { title: "Python Basics Starter Notebook (.ipynb)", fileUrl: "/resources/python-basics.ipynb", resourceType: "CODE", fileSize: "120 KB" },
          ],
        },
        {
          title: "Pandas DataFrames: Cleaning, Merging & Transforming",
          summary: "Master df.groupby(), pivot_table(), lambda functions, handling datetime objects, and missing value imputation.",
          durationMinutes: 50,
          orderIndex: 2,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Real-world dataset cleaning: parsing messy timestamp strings, vectorized operations, merging tabular datasets, and outlier identification.",
          resources: [
            { title: "Pandas Masterclass Exercise Notebook (.ipynb)", fileUrl: "/resources/pandas-exercises.ipynb", resourceType: "CODE", fileSize: "340 KB" },
          ],
        },
        {
          title: "Exploratory Data Analysis (EDA) & Statistical Visualization",
          summary: "Create distribution plots, correlation heatmaps, pairplots, and boxplots using Seaborn and Matplotlib.",
          durationMinutes: 45,
          orderIndex: 3,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Systematic EDA framework: univariate analysis, bivariate relationships, detecting skewness, and visualizing categorical breakdowns.",
          resources: [
            { title: "EDA Case Study Solution (.ipynb)", fileUrl: "/resources/eda-casestudy.ipynb", resourceType: "CODE", fileSize: "510 KB" },
          ],
        },
      ],
    },
    {
      title: "Module 6: Applied Business Statistics & Experimentation",
      description: "Bridge math and decision-making: probability distributions, hypothesis testing, A/B test analysis, and causal inference.",
      orderIndex: 6,
      skillsLearned: "Descriptive Statistics, Normal Distribution, Central Limit Theorem, Hypothesis Testing, A/B Testing, P-Values",
      lessons: [
        {
          title: "Descriptive Statistics & Business Metrics Distribution",
          summary: "Mean, Median, Standard Deviation, Interquartile Range (IQR), and understanding skewed business data.",
          durationMinutes: 30,
          orderIndex: 1,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Why average order value can be deceiving in heavy-tailed distributions. How to choose median over mean for salary and transaction analyses.",
          resources: [
            { title: "Statistical Distributions Cheatsheet (.pdf)", fileUrl: "/resources/stats-cheatsheet.pdf", resourceType: "CHEATSHEET", fileSize: "480 KB" },
          ],
        },
        {
          title: "Hypothesis Testing & Rigorous A/B Test Evaluation",
          summary: "Null hypothesis, t-tests, Z-tests, Chi-square tests, sample size determination, and statistical significance.",
          durationMinutes: 45,
          orderIndex: 2,
          isFreePreview: false,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          content: "Learn how modern tech companies run product experimentation: calculating Minimum Detectable Effect (MDE), avoiding p-hacking, and computing confidence intervals.",
          resources: [
            { title: "A/B Testing Calculation Spreadsheet (.xlsx)", fileUrl: "/resources/ab-test-calc.xlsx", resourceType: "DATASET", fileSize: "920 KB" },
          ],
        },
      ],
    },
  ];

  for (const mod of modulesData) {
    const createdModule = await prisma.module.create({
      data: {
        courseId: course.id,
        title: mod.title,
        description: mod.description,
        orderIndex: mod.orderIndex,
        skillsLearned: mod.skillsLearned,
        lessons: {
          create: mod.lessons.map((l) => ({
            title: l.title,
            summary: l.summary,
            durationMinutes: l.durationMinutes,
            orderIndex: l.orderIndex,
            isFreePreview: l.isFreePreview,
            videoUrl: l.videoUrl,
            content: l.content,
            resources: {
              create: l.resources || [],
            },
          })),
        },
        assignments: mod.assignment
          ? {
              create: [
                {
                  title: mod.assignment.title,
                  description: mod.assignment.description,
                  totalMarks: mod.assignment.totalMarks,
                  orderIndex: mod.assignment.orderIndex,
                },
              ],
            }
          : undefined,
      },
    });
    console.log(`  ✓ Created module: ${createdModule.title}`);
  }

  // 4. Create 6 Real-World Portfolio Projects
  const sampleProjects = [
    {
      title: "Sales Intelligence & Revenue Optimization Engine",
      category: "Sales Intelligence",
      skills: "SQL, Power BI, DAX, Data Modeling",
      description: "Analyze 250,000+ transaction records across 4 business regions to identify product line margin leakages, sales rep quota attainment, and seasonal discount elasticity.",
      instructions: "1. Load raw SQL schema.\n2. Create Star Schema data model with Fact_Sales and Dim_Customer, Dim_Product, Dim_Date.\n3. Write DAX measures for QoQ Growth, Margin %.\n4. Design interactive 3-page Power BI dashboard.\n5. Push code and documentation to GitHub repository.",
      datasetUrl: "/datasets/sales-intelligence-dataset.csv",
      orderIndex: 1,
    },
    {
      title: "Telecom Customer Churn & Lifetime Value Predictor",
      category: "Customer Churn",
      skills: "Python, Pandas, Seaborn, Statistics, A/B Testing",
      description: "Perform end-to-end exploratory analysis on 7,000+ subscriber accounts to detect early warning signs of contract cancellation and simulate retention campaign ROI.",
      instructions: "1. Handle categorical encoding and missing values with Pandas.\n2. Perform bivariate analysis between tenure, contract type, payment method, and churn.\n3. Calculate statistically significant differences using hypothesis tests.\n4. Document actionable retention strategy recommendations.",
      datasetUrl: "/datasets/telecom-churn-dataset.csv",
      orderIndex: 2,
    },
    {
      title: "Financial Performance & Risk Analytics Suite",
      category: "Financial Analytics",
      skills: "Excel, Power Query, Financial Modeling, Scenario Analysis",
      description: "Build an automated financial model consolidating multi-entity P&L statements, calculating EBITDA margins, debt service ratios, and 3-statement forecast scenarios.",
      instructions: "1. Ingest quarterly ledger CSV files with Power Query.\n2. Build dynamic sensitivity tables (WACC vs Terminal Growth).\n3. Create executive summary visualization with waterfall charts.",
      datasetUrl: "/datasets/financial-analytics-dataset.xlsx",
      orderIndex: 3,
    },
    {
      title: "E-Commerce Funnel Conversion & Cart Drop-off Diagnostic",
      category: "E-commerce Analytics",
      skills: "SQL, Tableau, Funnel Analytics, Cohort Tracking",
      description: "Trace 1.2M user web events through search -> product view -> add to cart -> checkout steps to pinpoint abandonment friction points across mobile vs desktop.",
      instructions: "1. Write SQL queries with LEAD/LAG window functions to build session paths.\n2. Build Tableau funnel chart and Sankey diagram visualization.\n3. Present conversion uplift opportunities to product managers.",
      datasetUrl: "/datasets/ecommerce-funnel-dataset.csv",
      orderIndex: 4,
    },
    {
      title: "HR Analytics: Talent Retention & Compensation Equity",
      category: "HR Analytics",
      skills: "Power BI, Python, Statistical Testing, Workforce Analytics",
      description: "Audit organization-wide salary distributions, gender pay parity, performance rating distributions, and identify departments with high flight risk.",
      instructions: "1. Clean sensitive HR employee logs.\n2. Run ANOVA statistical tests across salary bands.\n3. Build confidential HR dashboard with Row-Level Security (RLS).",
      datasetUrl: "/datasets/hr-analytics-dataset.csv",
      orderIndex: 5,
    },
    {
      title: "C-Suite Executive KPI Command Center",
      category: "Executive Dashboard",
      skills: "Tableau, SQL, Executive Storytelling, Cross-Functional BI",
      description: "Create a unified single-pane-of-glass executive portal unifying Sales, Marketing, Customer Support, and Operations metrics for weekly board reviews.",
      instructions: "1. Synthesize multi-department data sources.\n2. Implement top-level KPI scorecards with Sparklines and target vs actual variances.\n3. Optimize mobile viewing layout for iPad/tablet executive consumption.",
      datasetUrl: "/datasets/executive-kpi-dataset.csv",
      orderIndex: 6,
    },
  ];

  for (const p of sampleProjects) {
    await prisma.project.create({
      data: {
        courseId: course.id,
        title: p.title,
        category: p.category,
        skills: p.skills,
        description: p.description,
        instructions: p.instructions,
        datasetUrl: p.datasetUrl,
        orderIndex: p.orderIndex,
      },
    });
  }

  console.log("✅ 6 Portfolio Projects created");

  // 5. Enroll the Demo Student and create progress
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      status: "ACTIVE",
    },
  });

  // Mark the first 3 lessons completed for demo student
  const allLessons = await prisma.lesson.findMany({
    where: { module: { courseId: course.id } },
    orderBy: [{ module: { orderIndex: "asc" } }, { orderIndex: "asc" }],
  });

  for (let i = 0; i < 3 && i < allLessons.length; i++) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: allLessons[i].id,
        isCompleted: true,
        completedAt: new Date(Date.now() - (3 - i) * 86400000),
      },
    });
  }

  // Create 1 Project Submission for Demo Student
  const firstProject = await prisma.project.findFirst({
    where: { courseId: course.id },
  });

  if (firstProject) {
    await prisma.projectSubmission.create({
      data: {
        projectId: firstProject.id,
        userId: student.id,
        githubUrl: "https://github.com/aarav-analyst/sales-intelligence-bi-project",
        liveDemoUrl: "https://app.powerbi.com/view?r=eyJrIjoidGVzdC1kZW1vLWlkIn0",
        notes: "Completed all 3 dashboard tabs. Included QoQ growth DAX measures and cleaned dataset via Power Query.",
        status: "REVIEWED",
        score: 94,
        feedback: "Outstanding work on the star schema and DAX calculated measures. Clean visual hierarchy on the executive tab. Approved!",
        reviewedBy: "Rohan Verma (Lead Instructor)",
        reviewedAt: new Date(),
      },
    });
  }

  // Create 1 Issued Certificate for demo student
  await prisma.certificate.create({
    data: {
      certificateId: "CT-DA-2025-001",
      userId: student.id,
      courseId: course.id,
      issueDate: new Date(),
      verificationUrl: "/verify/CT-DA-2025-001",
      status: "ISSUED",
      grade: "Distinction (94%)",
    },
  });

  console.log("✅ Student enrollment, progress, project submission, and verified certificate seeded");

  // 6. Seed Realistic Placeholder Testimonials
  const testimonials = [
    {
      authorName: "Priya Sundaram",
      role: "Junior Data Analyst",
      company: "Retail Analytics Practice",
      batch: "Cohort 2024",
      review:
        "The emphasis on writing production-ready SQL and building full portfolio projects on GitHub made all the difference. In my interviews, the panel asked me deep questions directly about my Sales Intelligence project.",
      rating: 5,
      isFeatured: true,
      isVerified: true,
    },
    {
      authorName: "Vikram Malhotra",
      role: "Business Intelligence Specialist",
      company: "Supply Chain Solutions",
      batch: "Cohort 2024",
      review:
        "I was transitioning from a non-technical operations role. The structured roadmap from Excel foundations to Power BI DAX and Python EDA gave me the exact confidence I needed.",
      rating: 5,
      isFeatured: true,
      isVerified: true,
    },
    {
      authorName: "Sneha Mukherjee",
      role: "Associate Analyst",
      company: "Fintech Risk Team",
      batch: "Cohort 2025",
      review:
        "No fluff or generic theory. Every module is tied to practical business problems. The assignment reviews from mentors helped me fix mistakes in data modeling that books never talk about.",
      rating: 5,
      isFeatured: true,
      isVerified: true,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log("✅ Verified Testimonials seeded");

  // 7. Seed FAQs
  const faqs = [
    {
      question: "Do I need prior coding or math experience to enroll?",
      answer: "No. The Data Analytics Career Program starts from ground zero with structured spreadsheet logic and builds progressively into SQL, Power BI, Tableau, Python, and applied statistics. Dedication and practice are all that's required.",
      category: "GENERAL",
      orderIndex: 1,
    },
    {
      question: "How are the portfolio projects reviewed?",
      answer: "Every student builds 6 real-world portfolio projects hosted on GitHub. Instructors review your actual SQL scripts, DAX formulas, and Python notebooks line-by-line, providing scoring and constructive feedback before approving.",
      category: "CURRICULUM",
      orderIndex: 2,
    },
    {
      question: "What is the typical time commitment per week?",
      answer: "We recommend 8 to 10 hours per week, including guided lessons, live mentor Q&A sessions, hands-on lab exercises, and project submissions.",
      category: "GENERAL",
      orderIndex: 3,
    },
    {
      question: "Will I receive a verified certificate upon completion?",
      answer: "Yes. Once you complete all module lessons, pass assignments, and receive approval on all portfolio projects, you are issued an official, tamper-proof Career Transformer certificate with a unique public verification URL.",
      category: "CAREER",
      orderIndex: 4,
    },
    {
      question: "What payment options and installment plans are available?",
      answer: "We support one-time full payments as well as no-cost EMI / flexible installment options through Razorpay (UPI, Credit/Debit Cards, Net Banking, and major EMI providers).",
      category: "PAYMENT",
      orderIndex: 5,
    },
    {
      question: "How does the 'Book Free Demo' work?",
      answer: "When you request a demo, our academic advisor will schedule a 30-minute 1-on-1 walkthrough of the curriculum, show you the learning dashboard and sample student projects, and evaluate your career goals with zero obligation.",
      category: "ADMISSIONS",
      orderIndex: 6,
    },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }

  console.log("✅ FAQs seeded");

  // 8. Seed Sample Leads for Admin CRM
  const sampleLeads: Array<{
    name: string;
    email: string;
    phone: string;
    education: string;
    currentStatus: string;
    interestedCourse: string;
    message?: string;
    status: LeadStatus;
    source: string;
    adminNotes?: string;
  }> = [
    {
      name: "Karan Singhania",
      email: "karan.s@gmail.com",
      phone: "+91 98700 11223",
      education: "B.Tech Final Year",
      currentStatus: "College Student",
      interestedCourse: "Data Analytics Career Program",
      message: "Interested in the upcoming cohort. Want to clarify if weekend batches are available.",
      status: LeadStatus.NEW,
      source: "WEBSITE_HERO",
    },
    {
      name: "Meera Nair",
      email: "meera.nair@outlook.com",
      phone: "+91 97111 33445",
      education: "BBA / MBA",
      currentStatus: "Working Professional",
      interestedCourse: "Data Analytics Career Program",
      message: "Looking to switch from digital marketing to marketing analytics.",
      status: LeadStatus.CONTACTED,
      adminNotes: "Spoke on 14 Aug. Sent syllabus copy. Scheduled demo call for Saturday.",
      source: "COURSE_PAGE",
    },
    {
      name: "Devendra Joshi",
      email: "d.joshi@yahoo.com",
      phone: "+91 99222 44556",
      education: "B.Sc Statistics",
      currentStatus: "Fresher",
      interestedCourse: "Data Analytics Career Program",
      message: "Want to learn SQL and Power BI for entry-level analyst roles.",
      status: LeadStatus.QUALIFIED,
      adminNotes: "High intent. Applied for EMI option.",
      source: "PRICING_PAGE",
    },
  ];

  for (const l of sampleLeads) {
    await prisma.lead.create({ data: l });
  }

  console.log("✅ Sample Leads seeded");
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
