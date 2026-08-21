export interface DepartmentInfo {
  id: string;
  name: string;
  aliases: string[];
}

export const DEPARTMENTS: Record<string, DepartmentInfo> = {
  COMP_ENG: {
    id: "COMP_ENG",
    name: "Computer Engineering",
    aliases: [
      "computer engineering",
      "computer science",
      "computer science & engineering",
      "computer science and engineering",
      "cse",
      "ce",
      "cs",
      "computer",
      "comp_eng",
      "comp",
    ],
  },
  IT: {
    id: "IT",
    name: "Information Technology",
    aliases: [
      "information technology",
      "it",
      "infotech",
      "info tech",
      "information science",
      "ise",
    ],
  },
  MECH_ENG: {
    id: "MECH_ENG",
    name: "Mechanical Engineering",
    aliases: [
      "mechanical engineering",
      "mechanical",
      "mech",
      "me",
      "mech_eng",
      "mechanics",
    ],
  },
  ENTC: {
    id: "ENTC",
    name: "Electronics & Telecommunication",
    aliases: [
      "electronics & telecommunication",
      "electronics and telecommunication",
      "electronics and communication",
      "electronics & communication",
      "ece",
      "entc",
      "etc",
      "electronics",
    ],
  },
  DATA_SCI: {
    id: "DATA_SCI",
    name: "Data Science & AI",
    aliases: [
      "data science & ai",
      "data science and ai",
      "data science & artificial intelligence",
      "data science",
      "ai & ml",
      "ai and ml",
      "artificial intelligence and data science",
      "aids",
      "data_sci",
      "ds",
    ],
  },
  CIVIL_ENG: {
    id: "CIVIL_ENG",
    name: "Civil Engineering",
    aliases: [
      "civil engineering",
      "civil",
      "ce_civil",
      "civil_eng",
    ],
  },
  ELEC_ENG: {
    id: "ELEC_ENG",
    name: "Electrical Engineering",
    aliases: [
      "electrical engineering",
      "electrical",
      "eee",
      "ee",
      "elec_eng",
    ],
  },
};

export const DEPARTMENT_OPTIONS = Object.values(DEPARTMENTS).map((d) => ({
  value: d.id,
  label: d.name,
}));

/**
 * Normalizes any free-text or department ID into a canonical Department ID and formatted Name.
 */
export function normalizeDepartment(input?: string | null): {
  departmentId: string;
  departmentName: string;
} {
  if (!input || !input.trim()) {
    return {
      departmentId: "COMP_ENG",
      departmentName: "Computer Engineering",
    };
  }

  const clean = input.trim().toLowerCase();

  // 1. Direct ID match
  if (DEPARTMENTS[input.toUpperCase()]) {
    return {
      departmentId: DEPARTMENTS[input.toUpperCase()].id,
      departmentName: DEPARTMENTS[input.toUpperCase()].name,
    };
  }

  // 2. Alias search
  for (const dept of Object.values(DEPARTMENTS)) {
    if (dept.id.toLowerCase() === clean || dept.name.toLowerCase() === clean) {
      return { departmentId: dept.id, departmentName: dept.name };
    }
    if (dept.aliases.some((a) => a.toLowerCase() === clean)) {
      return { departmentId: dept.id, departmentName: dept.name };
    }
  }

  // 3. Substring match fallback
  for (const dept of Object.values(DEPARTMENTS)) {
    if (dept.aliases.some((a) => clean.includes(a.toLowerCase()) || a.toLowerCase().includes(clean))) {
      return { departmentId: dept.id, departmentName: dept.name };
    }
  }

  // 4. Default fallback to Computer Engineering
  return {
    departmentId: "COMP_ENG",
    departmentName: input.trim(),
  };
}

/**
 * Evaluates whether two department representations match canonically.
 */
export function isMatchingDepartment(dept1?: string | null, dept2?: string | null): boolean {
  if (!dept1 || !dept2) return false;
  const d1 = normalizeDepartment(dept1);
  const d2 = normalizeDepartment(dept2);
  return d1.departmentId === d2.departmentId;
}
