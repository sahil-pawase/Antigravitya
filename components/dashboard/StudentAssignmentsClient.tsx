"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Sparkles,
  Award,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  BarChart3,
  BookOpen,
  Send,
  Flame,
  Grid,
  Filter,
  Maximize2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface Question {
  id: number;
  category: "Excel & Modeling" | "SQL & Data Warehousing" | "Power BI & DAX" | "Tableau LOD" | "Python & Pandas" | "Statistics & A/B";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Comprehensive 30+ Question Assessment Bank
export const COMPREHENSIVE_30_QUESTIONS: Question[] = [
  // Section 1: Excel & Business Data Modeling (Q1 - Q5)
  {
    id: 1,
    category: "Excel & Modeling",
    question: "Which Excel function performs dynamic lookups in any direction without column index restrictions or errors when inserting columns?",
    options: ["VLOOKUP()", "XLOOKUP()", "HLOOKUP()", "INDEX/MATCH only"],
    correctIndex: 1,
    explanation: "XLOOKUP() searches both vertically and horizontally in any direction and does not break when new table columns are inserted.",
  },
  {
    id: 2,
    category: "Excel & Modeling",
    question: "In Power Query, which transformation operation unrolls monthly columnar data (Jan, Feb, Mar...) into a single normalized date-value column?",
    options: ["Transpose", "Unpivot Columns", "Group By", "Merge Queries"],
    correctIndex: 1,
    explanation: "Unpivot Columns converts wide cross-tab formats into tall tabular records suitable for relational modeling.",
  },
  {
    id: 3,
    category: "Excel & Modeling",
    question: "In Kimball dimensional modeling, what type of table contains quantitative transactional facts and foreign keys?",
    options: ["Dimension Table", "Bridge Table", "Fact Table", "Outrigger Table"],
    correctIndex: 2,
    explanation: "Fact tables contain numeric measurements (e.g. Sales Amount, Order Quantity) linked to dimension tables.",
  },
  {
    id: 4,
    category: "Excel & Modeling",
    question: "What is the standard formula used by growth analytics teams to calculate Customer Acquisition Cost (CAC)?",
    options: [
      "Total Revenue / Total Customers",
      "Total Sales & Marketing Spend / Number of New Customers Acquired",
      "Gross Profit / Operating Expenses",
      "Churn Rate × Average Revenue Per User (ARPU)",
    ],
    correctIndex: 1,
    explanation: "CAC is calculated by dividing total acquisition marketing & sales costs by the number of new customers added.",
  },
  {
    id: 5,
    category: "Excel & Modeling",
    question: "Which Excel Dynamic Array formula automatically extracts distinct values from a specified range into a spill array?",
    options: ["DISTINCT()", "UNIQUE()", "FILTER()", "SORT()"],
    correctIndex: 1,
    explanation: "UNIQUE() is an Excel dynamic array function that returns distinct rows or columns without duplicate entries.",
  },

  // Section 2: SQL Analytics & Window Functions (Q6 - Q12)
  {
    id: 6,
    category: "SQL & Data Warehousing",
    question: "Which SQL window function retrieves a value from the immediately preceding row in an ordered partition?",
    options: ["LEAD()", "LAG()", "FIRST_VALUE()", "NTH_VALUE()"],
    correctIndex: 1,
    explanation: "LAG() accesses data from a previous row in the partition without requiring a complex self-join.",
  },
  {
    id: 7,
    category: "SQL & Data Warehousing",
    question: "What is the key difference between RANK() and DENSE_RANK() in SQL window calculations?",
    options: [
      "RANK() ignores NULL values while DENSE_RANK() does not",
      "DENSE_RANK() produces consecutive rank numbers on ties (1, 2, 2, 3), whereas RANK() skips (1, 2, 2, 4)",
      "RANK() only works with integer partitions",
      "DENSE_RANK() sorts descending by default",
    ],
    correctIndex: 1,
    explanation: "DENSE_RANK() does not leave gaps in ranking positions when duplicate tie values occur.",
  },
  {
    id: 8,
    category: "SQL & Data Warehousing",
    question: "Which clause is mandatory inside the OVER() construct when using the ROW_NUMBER() window function?",
    options: ["PARTITION BY", "ORDER BY", "ROWS BETWEEN", "GROUP BY"],
    correctIndex: 1,
    explanation: "ROW_NUMBER() requires an ORDER BY clause to determine the deterministic sequence of row numbering.",
  },
  {
    id: 9,
    category: "SQL & Data Warehousing",
    question: "Which SQL clause defines Common Table Expressions (CTEs) for modular query readability?",
    options: ["CREATE TEMPORARY TABLE", "WITH ... AS ()", "DECLARE @Table", "SELECT INTO"],
    correctIndex: 1,
    explanation: "The WITH clause creates a Common Table Expression (CTE), creating temporary named result sets.",
  },
  {
    id: 10,
    category: "SQL & Data Warehousing",
    question: "How do you filter records after performing GROUP BY aggregation in a SQL query?",
    options: ["WHERE clause", "HAVING clause", "QUALIFY clause", "FILTER BY clause"],
    correctIndex: 1,
    explanation: "HAVING is evaluated after aggregation to filter grouped calculations like SUM() or COUNT().",
  },
  {
    id: 11,
    category: "SQL & Data Warehousing",
    question: "What is the default join behavior of the standard JOIN keyword in PostgreSQL and MySQL?",
    options: ["LEFT OUTER JOIN", "FULL OUTER JOIN", "INNER JOIN", "CROSS JOIN"],
    correctIndex: 2,
    explanation: "The bare JOIN keyword defaults to an INNER JOIN, returning only matching rows from both tables.",
  },
  {
    id: 12,
    category: "SQL & Data Warehousing",
    question: "Which window frame specification computes a running cumulative total from the start of the partition up to the current row?",
    options: [
      "ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING",
      "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
      "ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING",
      "RANGE BETWEEN CURRENT ROW AND CURRENT ROW",
    ],
    correctIndex: 1,
    explanation: "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW accumulates all prior rows in the partition into the active metric.",
  },

  // Section 3: Power BI & DAX Modeling (Q13 - Q18)
  {
    id: 13,
    category: "Power BI & DAX",
    question: "Which DAX function is used to modify or override the active filter context of a calculation?",
    options: ["SUMX()", "CALCULATE()", "FILTER()", "LOOKUPVALUE()"],
    correctIndex: 1,
    explanation: "CALCULATE() evaluates an expression in a modified filter context and is the cornerstone of advanced DAX.",
  },
  {
    id: 14,
    category: "Power BI & DAX",
    question: "What type of relationship cardinality is optimal between Dimension and Fact tables in Power BI?",
    options: ["Many-to-Many (*:*)", "One-to-Many (1:*)", "One-to-One (1:1)", "Bi-directional Many-to-Many"],
    correctIndex: 1,
    explanation: "A Star Schema utilizes One-to-Many (1:*) relationships from primary-key Dimension tables into Fact tables.",
  },
  {
    id: 15,
    category: "Power BI & DAX",
    question: "Which DAX time-intelligence function calculates sales for the exact corresponding dates in the previous year?",
    options: ["PREVIOUSYEAR()", "SAMEPERIODLASTYEAR()", "PARALLELPERIOD()", "DATESYTD()"],
    correctIndex: 1,
    explanation: "SAMEPERIODLASTYEAR() shifts the current date context back exactly 1 year for Year-over-Year (YoY) metrics.",
  },
  {
    id: 16,
    category: "Power BI & DAX",
    question: "What is the primary architectural difference between a Calculated Column and a DAX Measure in Power BI?",
    options: [
      "Calculated columns compute at query runtime, measures compute at refresh time",
      "Calculated columns consume RAM and row-by-row storage; measures compute on-the-fly at visual aggregation time",
      "Measures can only return text",
      "Calculated columns cannot use math operations",
    ],
    correctIndex: 1,
    explanation: "Calculated columns are evaluated during data refresh and stored in memory; DAX measures are computed dynamically at runtime.",
  },
  {
    id: 17,
    category: "Power BI & DAX",
    question: "What does the DAX function ALL(tableName) do when passed as a filter argument to CALCULATE()?",
    options: [
      "Selects all rows matching the user's slicer",
      "Clears/removes all external filters applied to that table to compute grand totals",
      "Deletes duplicate records from memory",
      "Returns a single scalar string",
    ],
    correctIndex: 1,
    explanation: "ALL() removes context filters from the specified table or columns, allowing percent-of-total calculations.",
  },
  {
    id: 18,
    category: "Power BI & DAX",
    question: "Which feature in Power BI enables end-users to drill down from Region → Country → City within a visual?",
    options: ["Drillthrough filters", "Field Hierarchies", "Bookmarks", "Tooltip pages"],
    correctIndex: 1,
    explanation: "Field hierarchies combine multi-level categorical attributes into a unified drill-down axis.",
  },

  // Section 4: Tableau & Visual Storytelling (Q19 - Q23)
  {
    id: 19,
    category: "Tableau LOD",
    question: "Which Level of Detail (LOD) expression in Tableau computes values at a higher or independent level of detail than the visualization?",
    options: ["{ INCLUDE : ... }", "{ EXCLUDE : ... }", "{ FIXED : ... }", "{ TABLE_CALC : ... }"],
    correctIndex: 2,
    explanation: "{ FIXED [Dimension] : Expression } calculates aggregates using the specified dimensions without reference to view dimensions.",
  },
  {
    id: 20,
    category: "Tableau LOD",
    question: "In Tableau, what visual indicator distinguishes Discrete fields from Continuous fields in the pill shelf?",
    options: [
      "Blue pills = Discrete (Headers), Green pills = Continuous (Axes)",
      "Green pills = Dimensions, Blue pills = Measures",
      "Yellow pills = Calculated fields, Blue pills = Raw fields",
      "Orange pills = Parameters",
    ],
    correctIndex: 0,
    explanation: "Blue pills represent Discrete fields (creating headers/buckets), while Green pills represent Continuous fields (generating continuous axes).",
  },
  {
    id: 21,
    category: "Tableau LOD",
    question: "Which Tableau feature enables user-controlled dynamic variables that can swap metrics or change top-N filter values?",
    options: ["Sets", "Parameters", "Groups", "Bins"],
    correctIndex: 1,
    explanation: "Parameters provide dynamic input values (e.g. Top N customers, currency switcher) that can be referenced in calculations.",
  },
  {
    id: 22,
    category: "Tableau LOD",
    question: "In Tableau order of operations, which filter is evaluated BEFORE Level of Detail { FIXED } expressions?",
    options: ["Dimension Filters", "Measure Filters", "Context Filters", "Table Calculation Filters"],
    correctIndex: 2,
    explanation: "Context Filters are evaluated before FIXED LOD expressions and top-N filters in the Tableau pipeline.",
  },
  {
    id: 23,
    category: "Tableau LOD",
    question: "Which chart type is best suited for visualizing correlations between two continuous variables across 1,000+ data points?",
    options: ["Pie Chart", "Scatter Plot", "Treemap", "Stacked Bar Chart"],
    correctIndex: 1,
    explanation: "Scatter plots plot pairs of continuous variables across Cartesian coordinates to identify linear and non-linear correlations.",
  },

  // Section 5: Python, Pandas & Data Wrangling (Q24 - Q28)
  {
    id: 24,
    category: "Python & Pandas",
    question: "Which Pandas DataFrame method is used to remove missing (NaN/None) values from a dataset?",
    options: ["df.remove_null()", "df.dropna()", "df.fillna()", "df.clean()"],
    correctIndex: 1,
    explanation: "df.dropna() removes rows or columns with null/missing values according to axis and threshold rules.",
  },
  {
    id: 25,
    category: "Python & Pandas",
    question: "Which Python visualization library provides a high-level statistical plotting interface built on top of Matplotlib?",
    options: ["NumPy", "Seaborn", "Scikit-Learn", "SciPy"],
    correctIndex: 1,
    explanation: "Seaborn offers built-in statistical visualization themes and complex charts (e.g., boxplots, pairplots, heatmaps).",
  },
  {
    id: 26,
    category: "Python & Pandas",
    question: "Which Pandas method groups data by categorical attributes to compute aggregated statistics (equivalent to SQL GROUP BY)?",
    options: ["df.pivot()", "df.groupby()", "df.aggregate()", "df.melt()"],
    correctIndex: 1,
    explanation: "df.groupby(['column']).agg(...) implements the Split-Apply-Combine workflow on tabular data.",
  },
  {
    id: 27,
    category: "Python & Pandas",
    question: "How do you quickly compute the mean, standard deviation, min, max, and quartile distributions for all numerical columns in Pandas?",
    options: ["df.info()", "df.describe()", "df.summary()", "df.head()"],
    correctIndex: 1,
    explanation: "df.describe() outputs summary statistics (count, mean, std, 25%, 50%, 75%, max) for numeric columns.",
  },
  {
    id: 28,
    category: "Python & Pandas",
    question: "Which Pandas function joins two DataFrames horizontally based on shared key columns?",
    options: ["pd.concat()", "pd.merge()", "df.append()", "df.union()"],
    correctIndex: 1,
    explanation: "pd.merge(df1, df2, on='key', how='inner/left/right/outer') executes SQL-style relational joins.",
  },

  // Section 6: Applied Business Statistics & A/B Testing (Q29 - Q30+)
  {
    id: 29,
    category: "Statistics & A/B",
    question: "In A/B hypothesis testing, what does a p-value less than 0.05 (p < 0.05) typically indicate?",
    options: [
      "The experiment failed and should be discarded",
      "Statistically significant evidence against the null hypothesis (unlikely due to random chance alone)",
      "The sample size was too small",
      "Variant B is 95% worse than Variant A",
    ],
    correctIndex: 1,
    explanation: "A p-value < 0.05 indicates statistical significance at the 95% confidence level, rejecting the null hypothesis.",
  },
  {
    id: 30,
    category: "Statistics & A/B",
    question: "Which metric of central tendency is least sensitive to extreme outlier skew in financial and salary datasets?",
    options: ["Mean (Average)", "Median", "Mode", "Standard Deviation"],
    correctIndex: 1,
    explanation: "The Median represents the 50th percentile middle value and is not distorted by extreme high or low outliers.",
  },
  {
    id: 31,
    category: "Statistics & A/B",
    question: "What is the Interquartile Range (IQR) rule commonly used for in exploratory data cleaning?",
    options: [
      "Calculating annual revenue growth",
      "Identifying and bounding statistical outliers (Q1 - 1.5×IQR and Q3 + 1.5×IQR)",
      "Replacing NULL values with the mean",
      "Normalizing categorical string columns",
    ],
    correctIndex: 1,
    explanation: "The IQR rule (Q3 - Q1) identifies values outside 1.5×IQR as statistical outliers in boxplot distributions.",
  },
  {
    id: 32,
    category: "Statistics & A/B",
    question: "What is a Type I error in statistical hypothesis testing?",
    options: [
      "False Positive: Rejecting the null hypothesis when it is actually true",
      "False Negative: Failing to reject the null hypothesis when it is false",
      "Sampling bias due to survey non-response",
      "Data truncation during database import",
    ],
    correctIndex: 0,
    explanation: "A Type I error is a False Positive error (detecting an effect or winner that does not genuinely exist in reality).",
  },
];

export interface AssignmentWithSubmission {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
  moduleTitle: string;
  submission?: {
    id: string;
    submissionContent: string;
    fileUrl?: string | null;
    status: "PENDING" | "SUBMITTED" | "REVIEWED" | "REJECTED";
    marksObtained?: number | null;
    feedback?: string | null;
    reviewedAt?: Date | string | null;
    createdAt: Date | string;
  } | null;
}

export function StudentAssignmentsClient({
  assignments,
}: {
  assignments: AssignmentWithSubmission[];
}) {
  const [activeAssignment, setActiveAssignment] = useState<AssignmentWithSubmission | null>(null);

  // Assessment Studio State
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    totalQuestions: number;
    correctCount: number;
    wrongCount: number;
    percentage: number;
    scoreObtained: number;
    maxMarks: number;
    passed: boolean;
  } | null>(null);

  const [optionalRepoUrl, setOptionalRepoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Camera & Audio Media Proctoring State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [showCameraPreview, setShowCameraPreview] = useState(false); // Default hidden background proctoring
  const [isMirrored, setIsMirrored] = useState(true);
  const [showMediaSettings, setShowMediaSettings] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [audioVolumeLevel, setAudioVolumeLevel] = useState<number>(0);
  const [assessmentDuration, setAssessmentDuration] = useState<number>(0);

  // Hardware Devices
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>("");
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);

  // Anti-Cheating & Integrity State
  const [copyAttemptCount, setCopyAttemptCount] = useState<number>(0);
  const [fullscreenViolationCount, setFullscreenViolationCount] = useState<number>(0);
  const [showCheatingWarningModal, setShowCheatingWarningModal] = useState<boolean>(false);
  const [warningReason, setWarningReason] = useState<string>("");
  const [warningCount, setWarningCount] = useState<number>(0);
  const [isTerminatedByCheating, setIsTerminatedByCheating] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const violationsRef = useRef<Array<{ type: string; timestamp: string; description: string }>>([]);

  // Refs for MediaStream & Web Audio & Telemetry & Snapshots & Real Audio Recording
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityEventsRef = useRef<string[]>([]);
  const snapshotsRef = useRef<Array<{ id: string; timestamp: string; reason: string; image: string; capturedAt: string }>>([]);
  const audioSamplesRef = useRef<number[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Filter questions by category if needed
  const allQuestions = COMPREHENSIVE_30_QUESTIONS;
  const categories = ["All", "Excel & Modeling", "SQL & Data Warehousing", "Power BI & DAX", "Tableau LOD", "Python & Pandas", "Statistics & A/B"];

  const filteredQuestions = activeCategoryFilter === "All"
    ? allQuestions
    : allQuestions.filter((q) => q.category === activeCategoryFilter);

  const refreshMediaDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const v = devices.filter((d) => d.kind === "videoinput");
      const a = devices.filter((d) => d.kind === "audioinput");
      setVideoDevices(v);
      setAudioDevices(a);
      if (v.length > 0 && !selectedVideoDeviceId) {
        setSelectedVideoDeviceId(v[0].deviceId);
      }
      if (a.length > 0 && !selectedAudioDeviceId) {
        setSelectedAudioDeviceId(a[0].deviceId);
      }
    } catch (err) {
      console.warn("Failed to enumerate media devices:", err);
    }
  };

  const bindVideoElement = (el: HTMLVideoElement | null) => {
    videoElementRef.current = el;
    if (el && videoStreamRef.current && el.srcObject !== videoStreamRef.current) {
      el.srcObject = videoStreamRef.current;
      el.play().catch(() => {});
    }
  };

  const captureProctoringSnapshot = useCallback((reason: string) => {
    try {
      const video = videoElementRef.current;
      if (!video) return;
      
      const width = video.videoWidth || 320;
      const height = video.videoHeight || 240;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
      
      // Keep up to 10 milestone snapshots
      if (snapshotsRef.current.length < 10) {
        snapshotsRef.current.push({
          id: `snap-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: formatTimer(assessmentDuration),
          reason,
          image: dataUrl,
          capturedAt: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.warn("Proctoring snapshot error:", err);
    }
  }, [assessmentDuration]);

  const startCamera = async (targetDeviceId?: string) => {
    try {
      setMediaError(null);
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      const deviceIdToUse = targetDeviceId || selectedVideoDeviceId;
      const constraints: MediaStreamConstraints = {
        video: deviceIdToUse
          ? { deviceId: { exact: deviceIdToUse }, width: { ideal: 640 }, height: { ideal: 480 } }
          : { width: { ideal: 640 }, height: { ideal: 480 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
        videoElementRef.current.play().then(() => {
          // Take initial start photo after 2.5 seconds
          setTimeout(() => {
            captureProctoringSnapshot("Exam Initialized • Student Face Verified");
          }, 2500);
        }).catch(() => {});
      }
      await refreshMediaDevices();
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((t) => t.stop());
      videoStreamRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startAudio = async (targetDeviceId?: string) => {
    try {
      setMediaError(null);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const deviceIdToUse = targetDeviceId || selectedAudioDeviceId;
      const constraints: MediaStreamConstraints = {
        audio: deviceIdToUse ? { deviceId: { exact: deviceIdToUse } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioStreamRef.current = stream;
      setIsMicActive(true);

      // Start actual audio recording with MediaRecorder
      try {
        audioChunksRef.current = [];
        const options: MediaRecorderOptions = {};
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          options.mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          options.mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          options.mimeType = "audio/mp4";
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        mediaRecorder.start(1000);
        mediaRecorderRef.current = mediaRecorder;
      } catch (recErr) {
        console.warn("MediaRecorder start error:", recErr);
      }

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        const audioCtx = new AudioCtxClass();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let lastSampleTime = 0;
        const updateLevel = (timestamp: number) => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          const normalized = Math.min(100, Math.round((average / 128) * 100 * 1.6));
          setAudioVolumeLevel(normalized);

          // Record audio samples every 5 seconds for telemetry graph
          if (timestamp - lastSampleTime > 5000 && audioSamplesRef.current.length < 50) {
            audioSamplesRef.current.push(normalized);
            lastSampleTime = timestamp;
          }

          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        animFrameRef.current = requestAnimationFrame(updateLevel);
      }
      await refreshMediaDevices();
    } catch (err: any) {
      console.error("Audio access failed:", err);
      setIsMicActive(false);
    }
  };

  const stopAudio = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicActive(false);
    setAudioVolumeLevel(0);
  };

  const stopAllMedia = useCallback(() => {
    stopCamera();
    stopAudio();
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const triggerCheatingViolation = useCallback(
    (type: string, reason: string) => {
      if (isSubmitted || isTerminatedByCheating) return;

      const timeStr = formatTimer(assessmentDuration);
      violationsRef.current.push({
        type,
        timestamp: timeStr,
        description: reason,
      });

      activityEventsRef.current.push(`🚨 CHEATING VIOLATION [${type}]: ${reason} at ${timeStr}`);
      captureProctoringSnapshot(`⚠️ Cheating Flag: ${reason}`);

      setWarningCount((prev) => {
        const next = prev + 1;
        setWarningReason(reason);
        setShowCheatingWarningModal(true);

        if (next >= 3) {
          // Automatic 3-violation termination
          setTimeout(() => {
            setIsTerminatedByCheating(true);
            setShowCheatingWarningModal(false);
            calculateAndSubmitAssessment(true);
          }, 1500);
        }
        return next;
      });
    },
    [isSubmitted, isTerminatedByCheating, assessmentDuration, captureProctoringSnapshot]
  );

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  useEffect(() => {
    if (!isAssessmentOpen) {
      // Ensure Dashboard is strictly normal view (exit fullscreen immediately)
      if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
      stopAllMedia();
      setAssessmentDuration(0);
      setTabSwitchCount(0);
      setCopyAttemptCount(0);
      setFullscreenViolationCount(0);
      setWarningCount(0);
      setShowCheatingWarningModal(false);
      setIsTerminatedByCheating(false);
      setShowMediaSettings(false);
      setShowCameraPreview(false);
      setMediaError(null);
    } else {
      setAssessmentDuration(0);
      setTabSwitchCount(0);
      setCopyAttemptCount(0);
      setFullscreenViolationCount(0);
      setWarningCount(0);
      setShowCheatingWarningModal(false);
      setIsTerminatedByCheating(false);
      setShowCameraPreview(false);
      snapshotsRef.current = [];
      audioSamplesRef.current = [];
      audioChunksRef.current = [];
      violationsRef.current = [];
      activityEventsRef.current = [
        `Assessment initialized with AI Anti-Cheating Lockdown at ${new Date().toLocaleTimeString()}`,
      ];

      durationTimerRef.current = setInterval(() => {
        setAssessmentDuration((prev) => {
          const next = prev + 1;
          // Capture periodic snapshots at 45s, 90s, 180s
          if (next === 45) {
            captureProctoringSnapshot("Periodic 45-Second Photo Verification");
          } else if (next === 90) {
            captureProctoringSnapshot("Periodic 90-Second Photo Verification");
          } else if (next === 180) {
            captureProctoringSnapshot("Periodic 3-Minute Photo Verification");
          }
          return next;
        });
      }, 1000);
      refreshMediaDevices();
      
      // Automatically request & start camera and audio when assessment opens
      startCamera();
      startAudio();

      // 1. Tab Switching & Focus Loss Prevention (Instant Auto-Submit on Tab Switch)
      const handleVisibilityChange = () => {
        if (document.hidden && isAssessmentOpen && !isSubmitted && !isTerminatedByCheating) {
          setTabSwitchCount((prev) => prev + 1);
          setIsTerminatedByCheating(true);
          violationsRef.current.push({
            type: "TAB_SWITCH_TERMINATION",
            timestamp: formatTimer(assessmentDuration),
            description: "CRITICAL VIOLATION: Student switched tabs / navigated away. Test was automatically submitted and disqualified.",
          });
          activityEventsRef.current.push(
            `🚨 CRITICAL CHEATING: Student switched tabs at ${formatTimer(assessmentDuration)}. Exam automatically submitted.`
          );
          captureProctoringSnapshot("🚨 Cheating Violation: Switched Browser Tab / Navigated Away");
          calculateAndSubmitAssessment(true);
        }
      };

      const handleWindowBlur = () => {
        if (!document.hidden && isAssessmentOpen && !isSubmitted && !isTerminatedByCheating) {
          setTabSwitchCount((prev) => prev + 1);
          setIsTerminatedByCheating(true);
          violationsRef.current.push({
            type: "WINDOW_BLUR_TERMINATION",
            timestamp: formatTimer(assessmentDuration),
            description: "CRITICAL VIOLATION: Exam window lost focus (split-screen / app switch). Test automatically submitted.",
          });
          activityEventsRef.current.push(
            `🚨 CRITICAL CHEATING: Window blur detected at ${formatTimer(assessmentDuration)}. Exam automatically submitted.`
          );
          captureProctoringSnapshot("🚨 Cheating Violation: Window Blur / Lost Focus");
          calculateAndSubmitAssessment(true);
        }
      };

      // 2. Right Click (Context Menu) Prevention
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        setCopyAttemptCount((prev) => prev + 1);
        triggerCheatingViolation("CONTEXT_MENU", "Right-click context menu is strictly disabled during the proctored exam.");
      };

      // 3. Copy, Cut, Paste Prevention
      const handleCopy = (e: ClipboardEvent) => {
        e.preventDefault();
        setCopyAttemptCount((prev) => prev + 1);
        triggerCheatingViolation("CLIPBOARD_COPY", "Copying examination questions is strictly prohibited.");
      };

      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        setCopyAttemptCount((prev) => prev + 1);
        triggerCheatingViolation("CLIPBOARD_PASTE", "Pasting external content into exam is strictly prohibited.");
      };

      const handleCut = (e: ClipboardEvent) => {
        e.preventDefault();
        setCopyAttemptCount((prev) => prev + 1);
        triggerCheatingViolation("CLIPBOARD_CUT", "Clipboard cut action blocked.");
      };

      // 4. Prohibited Keyboard Shortcuts (Ctrl+C, Ctrl+V, Ctrl+U, F12, DevTools)
      const handleKeyDown = (e: KeyboardEvent) => {
        const isCtrl = e.ctrlKey || e.metaKey;
        if (
          (isCtrl && (e.key === "c" || e.key === "C" || e.key === "v" || e.key === "V" || e.key === "a" || e.key === "A" || e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")) ||
          e.key === "F12" ||
          e.key === "PrintScreen" ||
          (isCtrl && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j"))
        ) {
          e.preventDefault();
          setCopyAttemptCount((prev) => prev + 1);
          triggerCheatingViolation("SHORTCUT_BLOCKED", `Prohibited keyboard shortcut (${e.key}) attempted.`);
        }
      };

      // 5. Fullscreen exit auto-submit listener
      const handleFullscreenChange = () => {
        const inFs = !!document.fullscreenElement;
        setIsFullscreen(inFs);
        if (!inFs && isAssessmentOpen && !isSubmitted && !isTerminatedByCheating) {
          setFullscreenViolationCount((prev) => prev + 1);
          setIsTerminatedByCheating(true);
          violationsRef.current.push({
            type: "FULLSCREEN_EXIT_TERMINATION",
            timestamp: formatTimer(assessmentDuration),
            description: "CRITICAL VIOLATION: Exited full-screen exam mode. Test was automatically submitted.",
          });
          activityEventsRef.current.push(
            `🚨 CRITICAL CHEATING: Exited fullscreen mode at ${formatTimer(assessmentDuration)}. Exam automatically submitted.`
          );
          captureProctoringSnapshot("🚨 Cheating Violation: Exited Full Screen Mode");
          calculateAndSubmitAssessment(true);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleWindowBlur);
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("copy", handleCopy);
      document.addEventListener("paste", handlePaste);
      document.addEventListener("cut", handleCut);
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleWindowBlur);
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("copy", handleCopy);
        document.removeEventListener("paste", handlePaste);
        document.removeEventListener("cut", handleCut);
        window.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
        stopAllMedia();
      };
    }
  }, [isAssessmentOpen, stopAllMedia, captureProctoringSnapshot, triggerCheatingViolation, isSubmitted, isTerminatedByCheating, assessmentDuration]);

  const startAssessment = async (a: AssignmentWithSubmission) => {
    setActiveAssignment(a);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setAssessmentResult(null);
    setOptionalRepoUrl(a.submission?.fileUrl || "");
    setSaveSuccess(false);
    setActiveCategoryFilter("All");
    setIsAssessmentOpen(true);

    // Automatically request Full Screen Mode when test starts
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn("Auto fullscreen request on test start:", err);
    }
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    const qObj = allQuestions.find((q) => q.id === questionId);
    if (qObj) {
      activityEventsRef.current.push(
        `Q${questionId} [${qObj.category}]: Selected "${qObj.options[optionIdx]}" (Option ${optionIdx + 1}) at ${formatTimer(assessmentDuration)}`
      );
    }
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const calculateAndSubmitAssessment = async (isForcedCheatingTermination: boolean = false) => {
    if (!activeAssignment) return;

    let correct = 0;
    let wrong = 0;

    allQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const percentage = Math.round((correct / allQuestions.length) * 100);
    const scoreObtained = isForcedCheatingTermination
      ? 0
      : Math.round((correct / allQuestions.length) * activeAssignment.totalMarks);
    const passed = !isForcedCheatingTermination && percentage >= 60;

    // Calculate AI Cheating & Integrity Score
    let integrityScore = 100;
    integrityScore -= tabSwitchCount * 20;
    integrityScore -= copyAttemptCount * 15;
    integrityScore -= fullscreenViolationCount * 10;
    if (!isCameraActive) integrityScore -= 25;
    if (!isMicActive) integrityScore -= 15;
    if (isForcedCheatingTermination) integrityScore = Math.min(integrityScore, 20);
    integrityScore = Math.max(0, Math.min(100, integrityScore));

    const cheatingRiskLevel = integrityScore >= 85 ? "LOW" : integrityScore >= 60 ? "MEDIUM" : "HIGH";

    const resultData = {
      totalQuestions: allQuestions.length,
      correctCount: correct,
      wrongCount: wrong,
      percentage,
      scoreObtained,
      maxMarks: activeAssignment.totalMarks,
      passed,
    };

    // Capture final snapshot on submission
    captureProctoringSnapshot(
      isForcedCheatingTermination
        ? "🚨 Auto-Terminated Due to Proctoring Cheating Violations"
        : "Final Exam Submission Check"
    );

    // Finalize Audio Recording into Playable Base64 Audio Data URL
    let audioDataUrl = "";
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || "");
          reader.onerror = () => resolve("");
          reader.readAsDataURL(audioBlob);
        });
      }
    } catch (e) {
      console.warn("Error finalizing audio blob:", e);
    }

    setAssessmentResult(resultData);
    setIsSubmitted(true);
    setIsSaving(true);

    try {
      const answersSummary = allQuestions
        .map(
          (q, i) =>
            `Q${i + 1} [${q.category}]: ${q.question}\nYour Selection: ${
              selectedAnswers[q.id] !== undefined ? q.options[selectedAnswers[q.id]] : "Not Answered"
            } (${selectedAnswers[q.id] === q.correctIndex ? "CORRECT ✓" : "INCORRECT ✗"})\nCorrect Answer: ${
              q.options[q.correctIndex]
            }\nFaculty Explanation: ${q.explanation}\n`
        )
        .join("\n");

      // Structured telemetry object for rich admin inspection
      const structuredTelemetry = {
        version: "1.0",
        type: "COMPREHENSIVE_32_QUESTION_ASSESSMENT",
        antiCheating: {
          integrityScore,
          cheatingRiskLevel,
          tabSwitchCount,
          copyAttemptCount,
          fullscreenViolationCount,
          warningCount,
          terminatedDueToCheating: isForcedCheatingTermination || warningCount >= 3,
          violations: violationsRef.current,
        },
        proctoring: {
          cameraActive: isCameraActive,
          micActive: isMicActive,
          durationSeconds: assessmentDuration,
          durationFormatted: formatTimer(assessmentDuration),
          tabSwitchCount: tabSwitchCount,
          submittedAt: new Date().toISOString(),
          devices: {
            video: selectedVideoDeviceId ? "Configured Webcam" : "Default Web Camera",
            audio: selectedAudioDeviceId ? "Configured Microphone" : "Default Microphone",
          },
          snapshots: snapshotsRef.current,
          audioSamples: audioSamplesRef.current,
          audioDataUrl: audioDataUrl || null,
        },
        score: {
          scoreObtained,
          maxMarks: activeAssignment.totalMarks,
          percentage,
          correctCount: correct,
          wrongCount: wrong,
          totalQuestions: allQuestions.length,
          passed,
        },
        activityTimeline: activityEventsRef.current,
        answers: allQuestions.map((q) => {
          const selectedIdx = selectedAnswers[q.id];
          const isCorrect = selectedIdx === q.correctIndex;
          return {
            questionId: q.id,
            category: q.category,
            question: q.question,
            options: q.options,
            selectedOptionIndex: selectedIdx !== undefined ? selectedIdx : null,
            selectedOption: selectedIdx !== undefined ? q.options[selectedIdx] : "Not Answered",
            correctOptionIndex: q.correctIndex,
            correctOption: q.options[q.correctIndex],
            isCorrect,
            explanation: q.explanation,
          };
        }),
      };

      const submissionText = `COMPREHENSIVE 32-QUESTION CURRICULUM ASSESSMENT:
Score: ${scoreObtained}/${activeAssignment.totalMarks} Marks (${percentage}%)
Performance: ${passed ? "PASSED 🏆" : isForcedCheatingTermination ? "DISQUALIFIED (CHEATING VIOLATION)" : "NEEDS RETAKE"}
Accuracy Breakdown: ${correct} Correct | ${wrong} Incorrect out of ${allQuestions.length} Questions

ANTI-CHEATING & INTEGRITY AUDIT:
- Trust Integrity Score: ${integrityScore}% (${cheatingRiskLevel} Risk)
- Tab Switches / Window Blur: ${tabSwitchCount}
- Prohibited Copy / Shortcut Attempts: ${copyAttemptCount}
- Disqualification Status: ${isForcedCheatingTermination ? "AUTO-TERMINATED DUE TO 3 PROCTORING VIOLATIONS" : "Normal Exam Completion"}

PROCTORING & MEDIA AUDIT:
- Camera Proctoring: ${isCameraActive ? "VERIFIED (Webcam Video Stream Active)" : "Disabled / Inactive"}
- Microphone Audio: ${isMicActive ? "VERIFIED (Live Microphone Stream Active)" : "Disabled / Inactive"}
- Assessment Active Time: ${formatTimer(assessmentDuration)}
- Focus Integrity / Tab Switches: ${tabSwitchCount === 0 ? "0 (100% Focused Session)" : `${tabSwitchCount} Tab Switch(es) Detected ⚠️`}
- Device Sources: Video [${selectedVideoDeviceId ? "Configured" : "Default"}] | Audio [${selectedAudioDeviceId ? "Configured" : "Default"}]

DETAILED AUDIT LOG:
${answersSummary}

<!-- TELEMETRY_JSON_START -->
${JSON.stringify(structuredTelemetry)}
<!-- TELEMETRY_JSON_END -->
`;

      await fetch("/api/submissions/assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: activeAssignment.id,
          submissionContent: submissionText,
          fileUrl: optionalRepoUrl || null,
          marksObtained: scoreObtained,
          feedback: passed
            ? `Outstanding performance! You answered ${correct} out of ${allQuestions.length} questions correctly (${percentage}%). Proctoring media verification confirmed.`
            : `Assessment completed with ${correct}/${allQuestions.length} correct. Review the question explanations and retake to score higher.`,
          status: "REVIEWED",
        }),
      });

      setSaveSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#162942] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Award className="w-7 h-7 text-[#41D8FF]" />
            <span>Curriculum Assessments & Capstones</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Complete the rigorous 32-question comprehensive data analytics assessment to evaluate your technical mastery.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081827] border border-[#162942] text-xs text-[#41D8FF] font-semibold">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>32 Questions Active • Automated Grading</span>
        </div>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 gap-5">
        {assignments.map((a) => {
          const sub = a.submission;

          return (
            <div
              key={a.id}
              className="rounded-3xl bg-[#081827]/90 border border-[#162942] hover:border-[#397CFF]/50 p-6 sm:p-7 space-y-5 transition-all shadow-xl backdrop-blur-md relative overflow-hidden group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0C1A2B] border border-[#162942] text-[11px] font-bold text-[#41D8FF] uppercase tracking-wider">
                      {a.moduleTitle}
                    </span>
                    <span className="text-xs text-[#64748B]">•</span>
                    <span className="text-xs text-[#94A3B8] font-mono flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#397CFF]" />
                      32 Full Assessment Questions
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#41D8FF] transition-colors">
                    {a.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {a.description}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-white font-bold font-mono px-3 py-1 rounded-xl bg-[#06101D] border border-white/10">
                    Max: {a.totalMarks} Marks
                  </span>

                  {sub && sub.marksObtained !== null && sub.marksObtained !== undefined ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Score: {sub.marksObtained}/{a.totalMarks} Marks</span>
                    </div>
                  ) : sub ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Submitted (Evaluating)</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#64748B] font-mono">Not Taken Yet</span>
                  )}
                </div>
              </div>

              {/* Assessment Action Bar */}
              <div className="pt-4 border-t border-[#162942] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-[#94A3B8] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#41D8FF]" />
                  <span>32 Questions • SQL, Power BI, Python, Excel & A/B Statistics</span>
                </div>

                <button
                  type="button"
                  onClick={() => startAssessment(a)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#397CFF] to-[#41D8FF] hover:opacity-95 text-[#06101D] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#397CFF]/20 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{sub ? "Retake / View 32-Question Assessment" : "Take Assessment (32 Questions) 🚀"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive 32-Question Assessment Modal */}
      {isAssessmentOpen && activeAssignment && (
        <Modal
          isOpen={isAssessmentOpen}
          onClose={() => {
            if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            }
            setIsAssessmentOpen(false);
          }}
          title={activeAssignment.title}
          description={`Comprehensive 32-Question Assessment • ${activeAssignment.moduleTitle}`}
          maxWidth="3xl"
        >
          {(() => {
            const currentQ = allQuestions[currentQuestionIndex];
            const totalQ = allQuestions.length;
            const answeredCount = Object.keys(selectedAnswers).length;

            return (
              <div className="space-y-6">
                {!isSubmitted ? (
                  // Active Question View
                  <div className="space-y-6">

                    {/* Header Stepper & Progress Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#CBD5E1] border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#41D8FF] font-mono text-sm">
                          Question {currentQuestionIndex + 1} of {totalQ}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px]">
                          {currentQ.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono flex items-center gap-1">
                          🔒 AI Anti-Cheating Active
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="px-2.5 py-1 rounded-lg bg-[#06101D] border border-[#397CFF]/40 text-[#41D8FF] text-[10px] font-bold flex items-center gap-1 hover:bg-[#397CFF]/10 cursor-pointer"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>{isFullscreen ? "Exit Fullscreen" : "📺 Fullscreen Mode"}</span>
                        </button>

                        {tabSwitchCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold animate-pulse flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {tabSwitchCount}/3 Tab Switches
                          </span>
                        )}

                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#397CFF]" />
                          {formatTimer(assessmentDuration)}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {answeredCount}/{totalQ} Answered
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {Math.round((answeredCount / totalQ) * 100)}% Completed
                        </span>
                      </div>
                    </div>

                    {/* Anti-Cheating Warning Overlay Modal */}
                    {showCheatingWarningModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <div className="max-w-md w-full rounded-3xl bg-[#0B0F17] border-2 border-rose-500/80 p-6 space-y-4 shadow-2xl text-center relative overflow-hidden">
                          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8 text-rose-400" />
                          </div>

                          <div className="space-y-1">
                            <span className="px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-extrabold uppercase tracking-wider">
                              Violation {warningCount} of 3
                            </span>
                            <h3 className="text-lg font-black text-white">PROCTORING INTEGRITY ALERT</h3>
                            <p className="text-xs text-rose-300 font-semibold">{warningReason}</p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#06101D] border border-white/10 text-left text-[11px] text-slate-300 space-y-1.5 font-mono">
                            <div>• Leaving the examination window is strictly prohibited.</div>
                            <div>• Copying questions or pasting answers is strictly blocked.</div>
                            <div>• A webcam snapshot frame was transmitted to the proctor.</div>
                            <div className="text-amber-400 font-bold">
                              • {3 - warningCount > 0 ? `${3 - warningCount} warnings remaining before auto-disqualification.` : "Maximum violations reached. Disqualifying exam..."}
                            </div>
                          </div>

                          {3 - warningCount > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowCheatingWarningModal(false)}
                              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 hover:opacity-95 transition-opacity cursor-pointer"
                            >
                              I Acknowledge & Return to Exam →
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#06101D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#397CFF] via-[#41D8FF] to-emerald-400 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQ) * 100}%` }}
                      />
                    </div>

                    {/* Question Jump Grid (1 to 32) */}
                    <div className="p-3 rounded-2xl bg-[#06101D] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                        <span className="flex items-center gap-1">
                          <Grid className="w-3.5 h-3.5 text-[#41D8FF]" />
                          <span>Question Navigator (Jump to any question):</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">32 Total Questions</span>
                      </div>

                      <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
                        {allQuestions.map((q, idx) => {
                          const isAnswered = selectedAnswers[q.id] !== undefined;
                          const isCurrent = currentQuestionIndex === idx;

                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => setCurrentQuestionIndex(idx)}
                              className={`h-7 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center justify-center ${
                                isCurrent
                                  ? "bg-[#41D8FF] text-[#06101D] ring-2 ring-white shadow-lg"
                                  : isAnswered
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-[#081827] text-slate-400 border border-white/5 hover:border-slate-600"
                              }`}
                              title={`Q${idx + 1}: ${q.category}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Question Box */}
                    <div className="p-6 rounded-2xl bg-[#06101D] border border-white/10 space-y-5 shadow-xl">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-mono text-[#41D8FF] font-bold">
                          {currentQ.category}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                          {currentQuestionIndex + 1}. {currentQ.question}
                        </h4>
                      </div>

                      <div className="space-y-2.5">
                        {currentQ.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[currentQ.id] === optIdx;

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(currentQ.id, optIdx)}
                              className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-[#397CFF]/25 border-[#41D8FF] text-white shadow-lg ring-1 ring-[#41D8FF]/50"
                                  : "bg-[#081827] border-[#162942] text-[#CBD5E1] hover:border-slate-600 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                                    isSelected
                                      ? "bg-[#41D8FF] text-[#06101D]"
                                      : "bg-[#0C1A2B] text-[#94A3B8] border border-white/10"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {isSelected && <Check className="w-4 h-4 text-[#41D8FF] flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Optional File / GitHub Link */}
                    <div className="space-y-1.5 text-xs">
                      <label className="text-[#CBD5E1] font-semibold">
                        Attach GitHub Portfolio / Drive Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={optionalRepoUrl}
                        onChange={(e) => setOptionalRepoUrl(e.target.value)}
                        placeholder="https://github.com/your-name/sql-analytics-lab"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#41D8FF]"
                      />
                    </div>

                    {/* Stepper Footer Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                        className="px-4 py-2 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-[#94A3B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {currentQuestionIndex < totalQ - 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                            className="px-5 py-2 rounded-xl bg-[#0C1A2B] border border-[#397CFF]/40 text-xs font-bold text-[#41D8FF] hover:bg-[#397CFF]/20 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Next Question</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => calculateAndSubmitAssessment(false)}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#397CFF] to-[#41D8FF] text-[#06101D] font-extrabold text-xs shadow-lg shadow-[#397CFF]/30 flex items-center gap-2 cursor-pointer hover:opacity-95 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Assessment ({answeredCount}/32 Answered)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Results & 32-Question Detailed Audit Breakdown
                  assessmentResult && (
                    <div className="space-y-6">
                      {/* Score Banner */}
                      <div
                        className={`p-6 sm:p-8 rounded-3xl border text-center space-y-4 shadow-2xl relative overflow-hidden ${
                          assessmentResult.passed
                            ? "bg-gradient-to-br from-emerald-950/60 via-[#081827] to-[#06101D] border-emerald-500/40"
                            : "bg-gradient-to-br from-rose-950/60 via-[#081827] to-[#06101D] border-rose-500/40"
                        }`}
                      >
                        {isTerminatedByCheating ? (
                          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/30 border border-rose-500/50 text-xs font-black text-rose-300 animate-pulse">
                            🚨 EXAM AUTOMATICALLY SUBMITTED & DISQUALIFIED (PROCTORING VIOLATION)
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white">
                            {assessmentResult.passed ? "🏆 32-QUESTION ASSESSMENT PASSED" : "⚠️ ASSESSMENT NEEDS RETAKE"}
                          </div>
                        )}

                        {isTerminatedByCheating && (
                          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-left text-xs text-rose-300 space-y-1.5 max-w-xl mx-auto font-mono">
                            <strong className="text-white block text-sm font-sans flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                              Anti-Cheating Disqualification:
                            </strong>
                            <p>
                              Unauthorized tab switching, window blur, or exiting full screen was detected. The examination was automatically terminated and submitted to the administrator with photo and audio evidence.
                            </p>
                          </div>
                        )}

                        <h3 className="text-3xl sm:text-5xl font-extrabold text-white font-mono">
                          {assessmentResult.scoreObtained} / {assessmentResult.maxMarks} Marks
                        </h3>

                        <p className="text-sm font-mono text-[#CBD5E1]">
                          Accuracy: {assessmentResult.percentage}% • {assessmentResult.correctCount} / {assessmentResult.totalQuestions} Questions Correct
                        </p>

                        {/* Breakdown Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{assessmentResult.correctCount} Correct Questions</span>
                          </div>

                          <div className="px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            <span>{assessmentResult.wrongCount} Incorrect Questions</span>
                          </div>
                        </div>

                        {saveSuccess && (
                          <div className="text-xs text-emerald-400 font-semibold pt-2">
                            ✓ Scored results and detailed audit log saved to your student profile!
                          </div>
                        )}
                      </div>

                      {/* Filter Category Pills for Review */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#41D8FF] flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Question-by-Question Review (All 32 Questions):</span>
                          </h4>

                          <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategoryFilter(cat)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors whitespace-nowrap cursor-pointer ${
                                  activeCategoryFilter === cat
                                    ? "bg-[#41D8FF] text-[#06101D]"
                                    : "bg-[#06101D] text-[#94A3B8] border border-white/5 hover:text-white"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Scrollable Questions Review List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                          {filteredQuestions.map((q) => {
                            const studentAnsIdx = selectedAnswers[q.id];
                            const isCorrect = studentAnsIdx === q.correctIndex;

                            return (
                              <div
                                key={q.id}
                                className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                                  isCorrect
                                    ? "bg-[#06101D] border-emerald-500/30"
                                    : "bg-[#06101D] border-rose-500/30"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-[#41D8FF]">
                                      {q.category}
                                    </span>
                                    <span className="font-bold text-white text-xs sm:text-sm block">
                                      {q.id}. {q.question}
                                    </span>
                                  </div>

                                  {isCorrect ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex-shrink-0 flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Correct
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold text-[10px] flex-shrink-0 flex items-center gap-1">
                                      <XCircle className="w-3 h-3" /> Wrong
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-1 pt-1 text-[11px]">
                                  <div className="text-slate-300">
                                    <span className="text-slate-500 font-semibold">Your Selection: </span>
                                    <strong className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                                      {studentAnsIdx !== undefined ? q.options[studentAnsIdx] : "Not Answered"}
                                    </strong>
                                  </div>

                                  {!isCorrect && (
                                    <div className="text-emerald-400">
                                      <span className="text-slate-500 font-semibold">Correct Answer: </span>
                                      <strong>{q.options[q.correctIndex]}</strong>
                                    </div>
                                  )}

                                  <div className="p-2.5 rounded-xl bg-[#081827] border border-white/5 text-slate-300 mt-2">
                                    <strong className="text-[#41D8FF] block mb-0.5">Faculty Explanation:</strong>
                                    <span>{q.explanation}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#162942]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAnswers({});
                            setIsSubmitted(false);
                            setCurrentQuestionIndex(0);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#06101D] hover:bg-[#0C1A2B] border border-[#162942] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#41D8FF]" />
                          <span>Retake 32-Question Assessment</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAssessmentOpen(false);
                            window.location.reload();
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#41D8FF] hover:bg-[#397CFF] text-[#06101D] font-extrabold text-xs cursor-pointer transition-colors shadow-md"
                        >
                          Save & Return to Dashboard
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Hidden offscreen video element to ensure active webcam frame rendering for canvas snapshots */}
      <video
        ref={(el) => {
          videoElementRef.current = el;
          if (el && videoStreamRef.current && el.srcObject !== videoStreamRef.current) {
            el.srcObject = videoStreamRef.current;
            el.play().catch(() => {});
          }
        }}
        autoPlay
        playsInline
        muted
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "320px",
          height: "240px",
          pointerEvents: "none",
          opacity: 0,
        }}
      />
    </div>
  );
}
