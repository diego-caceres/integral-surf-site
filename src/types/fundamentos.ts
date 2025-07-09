export type FundamentosTeamMember = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  order_number: number;
};

export type FundamentosSection = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  order_number: number;
  team_members: FundamentosTeamMember[];
};

export type FundamentosPage = {
  id: string;
  sections: FundamentosSection[];
  created_at: string;
  updated_at: string;
};
