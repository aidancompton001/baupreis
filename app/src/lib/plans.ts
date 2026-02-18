export const PLAN_LIMITS = {
  trial: {
    materials: 99,
    users: 5,
    alerts: 999,
    telegram: true,
    forecast: true,
    api: true,
    pdf: true,
  },
  basis: {
    materials: 5,
    users: 1,
    alerts: 3,
    telegram: false,
    forecast: false,
    api: false,
    pdf: false,
  },
  pro: {
    materials: 99,
    users: 1,
    alerts: 999,
    telegram: true,
    forecast: true,
    api: false,
    pdf: false,
  },
  team: {
    materials: 99,
    users: 5,
    alerts: 999,
    telegram: true,
    forecast: true,
    api: true,
    pdf: true,
  },
};

export function applyPlanToOrg(plan: string) {
  const limits =
    PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.basis;
  return {
    plan,
    max_materials: limits.materials,
    max_users: limits.users,
    max_alerts: limits.alerts,
    features_telegram: limits.telegram,
    features_forecast: limits.forecast,
    features_api: limits.api,
    features_pdf_reports: limits.pdf,
  };
}

export const PLAN_PRICES = {
  basis: { monthly: 1, yearly: 10 },
  pro: { monthly: 149, yearly: 1430 },
  team: { monthly: 299, yearly: 2870 },
};
