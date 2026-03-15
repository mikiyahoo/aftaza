export interface StatCardProps {
  title: string;
  value: number | string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

export interface PropertiesChartProps {
  data: Array<{
    month: string;
    properties: number;
  }>;
}

export interface InquiriesChartProps {
  data: Array<{
    month: string;
    inquiries: number;
  }>;
}

export interface RecentActivityProps {
  properties: Array<{
    pkey: number;
    title: string;
    created_at: string;
    company: {
      name: string;
    };
  }>;
  inquiries: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
    property: {
      title: string;
    };
  }>;
}
