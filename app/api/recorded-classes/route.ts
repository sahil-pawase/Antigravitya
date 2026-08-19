import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export interface LectureStep {
  stepNumber: number;
  title: string;
  duration: string;
  summary: string;
  codeSnippet: string;
  isCompleted?: boolean;
}

export interface RecordedMasterclass {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  avatar: string;
  category: "sql" | "powerbi" | "python" | "excel" | "eda" | string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  completedPercentage: number;
  thumbnailGradient: string;
  description: string;
  youtubeId: string;
  datasetName: string;
  datasetSize: string;
  isLiveRecording?: boolean;
  recordedDate?: string;
  lectureSteps: LectureStep[];
  instructorNotes: string[];
}

declare global {
  var __recordedClassesState: RecordedMasterclass[] | undefined;
}

if (!global.__recordedClassesState) {
  global.__recordedClassesState = [
    {
      id: "rec-1",
      title: "Mastering Advanced SQL: Complex Joins, CTEs & Window Functions",
      instructor: "Sahil Pawase",
      instructorTitle: "Lead Analytics Architect & Mentor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahil",
      category: "sql",
      level: "Intermediate",
      duration: "58 mins",
      rating: 4.9,
      completedPercentage: 85,
      thumbnailGradient: "from-[#0C1A2B] via-[#081827] to-[#06101D] border-[#397CFF]/30",
      description: "Complete hands-on masterclass on Common Table Expressions (CTEs), self-joins, window functions (ROW_NUMBER, DENSE_RANK, LEAD/LAG), and real-time query optimization on e-commerce datasets.",
      youtubeId: "HXV3zeRR3h4", // High quality SQL Database & Window Functions course
      datasetName: "swiggy_orders_master.sql",
      datasetSize: "4.2 MB (100,000 Rows)",
      lectureSteps: [
        {
          stepNumber: 1,
          title: "Business Problem & Relational Architecture Setup",
          duration: "10 mins",
          summary: "Understanding the Swiggy customer orders database schema, identifying primary keys, foreign key relations, and indexing strategies.",
          codeSnippet: "-- 1. Check schema indexes and active partitions\nSELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'orders';",
        },
        {
          stepNumber: 2,
          title: "Multi-Layer CTEs & Running Revenue Calculation",
          duration: "18 mins",
          summary: "Constructing multi-tier WITH clauses to isolate customer ordering habits before computing windowed financial metrics.",
          codeSnippet: "WITH customer_orders AS (\n    SELECT customer_id, order_id, order_amount, order_timestamp,\n           ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_timestamp) AS order_num\n    FROM orders\n)\nSELECT * FROM customer_orders WHERE order_num <= 3;",
        },
        {
          stepNumber: 3,
          title: "LEAD & LAG Time-Series Delivery Delay Analytics",
          duration: "15 mins",
          summary: "Computing the exact interval between successive orders to detect churn patterns and repeat ordering cycles.",
          codeSnippet: "SELECT customer_id, order_timestamp,\n       LAG(order_timestamp, 1) OVER(PARTITION BY customer_id ORDER BY order_timestamp) AS prev_order,\n       order_timestamp - LAG(order_timestamp, 1) OVER(PARTITION BY customer_id ORDER BY order_timestamp) AS time_between_orders\nFROM orders;",
        },
        {
          stepNumber: 4,
          title: "Query Profiling (EXPLAIN ANALYZE) & Capstone Assignment",
          duration: "15 mins",
          summary: "Reading query execution plans, eliminating sequential table scans, and solving real data analyst interview case studies.",
          codeSnippet: "EXPLAIN ANALYZE\nSELECT city, COUNT(order_id) AS total_orders\nFROM orders\nGROUP BY city;",
        },
      ],
      instructorNotes: [
        "Always define explicit partition keys when using OVER() to prevent full memory buffer spills.",
        "DENSE_RANK() must be favored over RANK() when generating continuous leaderboard rankings without gaps.",
        "Remember to run VACUUM ANALYZE before testing complex analytical queries on PostgreSQL.",
      ],
    },
    {
      id: "rec-2",
      title: "Power BI Executive Dashboard Studio: End-to-End Build",
      instructor: "Dr. Sarah Mitchell",
      instructorTitle: "Senior BI Consultant",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      category: "powerbi",
      level: "Beginner",
      duration: "52 mins",
      rating: 4.9,
      completedPercentage: 100,
      thumbnailGradient: "from-amber-950/40 via-[#081827] to-[#06101D] border-amber-500/30",
      description: "Build an executive-ready sales performance dashboard from scratch: star schema modeling, core DAX revenue measures, custom KPI cards, and cross-filtering visuals.",
      youtubeId: "TmhQCBetgtE", // Power BI Full Course
      datasetName: "sales_executive_dashboard.pbix",
      datasetSize: "8.6 MB",
      lectureSteps: [
        {
          stepNumber: 1,
          title: "Star Schema Data Modeling & Relationship Cardinality",
          duration: "12 mins",
          summary: "Setting up dimension tables (Dim_Date, Dim_Customer, Dim_Product) and linking them to Fact_Sales with 1-to-many single-direction filters.",
          codeSnippet: "// Fact_Sales -> Dim_Customer (Many to One Single Direction)",
        },
        {
          stepNumber: 2,
          title: "Writing Core DAX Revenue & YoY Growth Measures",
          duration: "20 mins",
          summary: "Mastering CALCULATE, SAMEPERIODLASTYEAR, and DIVIDE to calculate Year-over-Year revenue variance.",
          codeSnippet: "YoY Growth % = \nVAR CurrentYearSales = [Total Revenue]\nVAR PrevYearSales = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(Dim_Date[Date]))\nRETURN\nDIVIDE(CurrentYearSales - PrevYearSales, PrevYearSales, 0)",
        },
        {
          stepNumber: 3,
          title: "Visual Layout, Drill-Throughs & Mobile Responsive View",
          duration: "20 mins",
          summary: "Designing high-contrast executive cards, interactive tooltip pages, and publishing reports to Power BI Service.",
          codeSnippet: "// Apply color hex palette: #06101D (Background), #397CFF (Primary), #41D8FF (Accent)",
        },
      ],
      instructorNotes: [
        "Never use bi-directional relationships unless specifically required for multi-fact tables.",
        "Always use DIVIDE() instead of '/' to handle division by zero errors automatically.",
      ],
    },
    {
      id: "rec-3",
      title: "Python Data Cleaning & Pandas Automation Pipelines",
      instructor: "Aarav Patel",
      instructorTitle: "Senior Data Analyst",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
      category: "python",
      level: "Intermediate",
      duration: "45 mins",
      rating: 4.8,
      completedPercentage: 40,
      thumbnailGradient: "from-emerald-950/40 via-[#081827] to-[#06101D] border-emerald-500/30",
      description: "Automate repetitive data cleaning tasks: handling corrupted timestamps, string normalization, regex extraction, and exporting structured ETL outputs.",
      youtubeId: "r-uOLxNrNk8", // Python for Data Analysis
      datasetName: "raw_customer_leads.csv",
      datasetSize: "2.1 MB",
      lectureSteps: [
        {
          stepNumber: 1,
          title: "Loading Messy Data & Inspecting Info/Nulls",
          duration: "10 mins",
          summary: "Identifying missing values, detecting wrong column data types, and plotting missingness matrix.",
          codeSnippet: "import pandas as pd\ndf = pd.read_csv('raw_customer_leads.csv')\nprint(df.isnull().sum())",
        },
        {
          stepNumber: 2,
          title: "Regex Cleaning & Phone/Email Standardization",
          duration: "18 mins",
          summary: "Extracting valid 10-digit phone numbers and sanitizing corporate email domains using regex.",
          codeSnippet: "df['clean_phone'] = df['phone'].str.replace(r'\D+', '', regex=True)\ndf['clean_phone'] = df['clean_phone'].apply(lambda x: x[-10:] if len(str(x)) >= 10 else None)",
        },
        {
          stepNumber: 3,
          title: "Building Automated Pipeline Function",
          duration: "17 mins",
          summary: "Encapsulating the entire transformation into a reusable python function with logging and CSV export.",
          codeSnippet: "def run_etl_pipeline(input_file, output_file):\n    df = pd.read_csv(input_file)\n    # Transformations...\n    df.to_csv(output_file, index=False)\n    print('ETL Pipeline Completed Successfully!')",
        },
      ],
      instructorNotes: [
        "Avoid using df.dropna() blindly; impute categorical features with mode or 'Unknown'.",
        "Use vectorized string methods (df['col'].str) instead of row-by-row apply loops for 100x speedups.",
      ],
    },
    {
      id: "rec-4",
      title: "Exploratory Data Analysis (EDA) & Statistical Inference",
      instructor: "Sahil Pawase",
      instructorTitle: "Lead Analytics Architect",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahil",
      category: "eda",
      level: "Beginner",
      duration: "40 mins",
      rating: 5.0,
      completedPercentage: 10,
      thumbnailGradient: "from-cyan-950/40 via-[#081827] to-[#06101D] border-[#41D8FF]/30",
      description: "Master descriptive statistics, IQR outlier detection, skewness transformation, and correlation heatmaps to uncover actionable business insights.",
      youtubeId: "gp5H0Vw39yw", // EDA Tutorial
      datasetName: "student_performance_stats.csv",
      datasetSize: "1.4 MB",
      lectureSteps: [
        {
          stepNumber: 1,
          title: "Summary Statistics & Skewness Analysis",
          duration: "12 mins",
          summary: "Calculating mean, median, standard deviation, and checking for log-normal distributions.",
          codeSnippet: "print(df.describe().T)\nprint('Skewness:', df['revenue'].skew())",
        },
        {
          stepNumber: 2,
          title: "Interquartile Range (IQR) Outlier Filtering",
          duration: "15 mins",
          summary: "Computing Q1, Q3, and setting up outlier fence thresholds (Q1 - 1.5*IQR to Q3 + 1.5*IQR).",
          codeSnippet: "Q1 = df['amount'].quantile(0.25)\nQ3 = df['amount'].quantile(0.75)\nIQR = Q3 - Q1\nfiltered_df = df[(df['amount'] >= Q1 - 1.5*IQR) & (df['amount'] <= Q3 + 1.5*IQR)]",
        },
        {
          stepNumber: 3,
          title: "Correlation Heatmaps & Multi-Collinearity Checks",
          duration: "13 mins",
          summary: "Visualizing Pearson correlation matrices to identify strongest predictive factors.",
          codeSnippet: "import seaborn as sns\nimport matplotlib.pyplot as plt\nsns.heatmap(df.corr(), annot=True, cmap='Blues')",
        },
      ],
      instructorNotes: [
        "Always compare Mean vs Median: if Mean >> Median, your distribution is heavily right-skewed.",
      ],
    },
    {
      id: "rec-5",
      title: "Advanced Excel for Business Analytics: XLOOKUP & Power Query",
      instructor: "Dr. Sarah Mitchell",
      instructorTitle: "Senior BI Consultant",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      category: "excel",
      level: "Beginner",
      duration: "48 mins",
      rating: 4.9,
      completedPercentage: 0,
      thumbnailGradient: "from-teal-950/40 via-[#081827] to-[#06101D] border-teal-500/30",
      description: "Modern Excel workflows: replacing VLOOKUP with XLOOKUP, unpivoting datasets in Power Query, and building automated refresh models.",
      youtubeId: "Vl0H-qTclOg", // Advanced Excel
      datasetName: "financial_modelling_master.xlsx",
      datasetSize: "3.5 MB",
      lectureSteps: [
        {
          stepNumber: 1,
          title: "Dynamic Arrays & Two-Way XLOOKUP",
          duration: "15 mins",
          summary: "Writing 2D XLOOKUP formulas to pull metrics across both rows and column headers dynamically.",
          codeSnippet: "=XLOOKUP(A2, Products[ID], XLOOKUP(B1, Products[#Headers], Products))",
        },
        {
          stepNumber: 2,
          title: "Power Query Unpivot & Automated Merge",
          duration: "18 mins",
          summary: "Transforming wide month-by-month tables into normalized long format for instant Pivot Table aggregation.",
          codeSnippet: "// Select Month columns -> Right Click -> Unpivot Columns",
        },
        {
          stepNumber: 3,
          title: "Building Automated Executive KPI Dashboard",
          duration: "15 mins",
          summary: "Creating dynamic slicers, timeline selectors, and formatted financial summary cards.",
          codeSnippet: "=SUMIFS(Sales[Revenue], Sales[Region], 'North', Sales[Year], 2025)",
        },
      ],
      instructorNotes: [
        "Never hardcode row numbers in lookup formulas; always convert data ranges into Excel Tables (Ctrl + T).",
      ],
    },
  ];
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    masterclasses: global.__recordedClassesState,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newRecording: RecordedMasterclass = {
      id: "rec-" + Date.now(),
      title: body.title || "Live Cohort Lecture Recording",
      instructor: body.instructor || session.fullName || "Sahil Pawase",
      instructorTitle: body.instructorTitle || "Lead Analytics Architect",
      avatar: body.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(body.instructor || "Sahil"),
      category: body.category || "sql",
      level: body.level || "Intermediate",
      duration: body.duration || "55 mins",
      rating: 5.0,
      completedPercentage: 0,
      thumbnailGradient: body.thumbnailGradient || "from-rose-950/40 via-[#081827] to-[#06101D] border-rose-500/40",
      description: body.description || "Full recorded masterclass from live cohort interactive session.",
      youtubeId: body.youtubeId || "HXV3zeRR3h4",
      datasetName: body.datasetName || "practice_dataset.csv",
      datasetSize: "3.2 MB",
      isLiveRecording: true,
      recordedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lectureSteps: [
        {
          stepNumber: 1,
          title: "Cohort Problem Statement & Schema Walkthrough",
          duration: "10 mins",
          summary: "Live review of the business requirements and entity relationship diagrams.",
          codeSnippet: "SELECT * FROM cohort_dataset LIMIT 20;",
        },
        {
          stepNumber: 2,
          title: "Live Analytical Solution & Code Construction",
          duration: "25 mins",
          summary: "Step-by-step query optimization, CTE composition, and data transformations.",
          codeSnippet: "WITH analytics AS (\n    SELECT *, DENSE_RANK() OVER(ORDER BY total_amount DESC) AS rank\n    FROM cohort_dataset\n)\nSELECT * FROM analytics WHERE rank <= 10;",
        },
        {
          stepNumber: 3,
          title: "Student Q&A, Edge Cases & Interview Insights",
          duration: "20 mins",
          summary: "Live interactive discussion answering student queries and reviewing capstone submissions.",
          codeSnippet: "-- Edge Case: Handling NULL partitions and duplicate timestamps",
        },
      ],
      instructorNotes: [
        "Review the attached dataset and test the sample queries before attempting the module assignment.",
      ],
    };

    global.__recordedClassesState?.unshift(newRecording);

    return NextResponse.json({ success: true, recording: newRecording });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to archive recording" }, { status: 500 });
  }
}
