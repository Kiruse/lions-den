
export type FirestoreDate = {
  seconds: number;
  nanoseconds: number;
}

/** Proposal data as returned by the proposal query */
export type PropData = {
  proposal: Proposal;
  proposal_status: string;
  results: Vote[];
  total_votes_available: string; // bigint
}

export type Proposal = {
  proposal_type: string;
  id: number | string;
  proposer: string; // ignore, it's not accurate
  title: string;
  description: string;
  status: string;
  started_at: string; // bigint timestamp
  expires: Expiration;
  proposal_actions: ProposalAction[];
}

export type Vote = [VoteType, string]; // type, total voting power
export enum VoteType {
  Yes,
  No,
  Abstain,
  Veto,
};

export type Expiration = any; // TODO: there's 3 types of expiration

export type ProposalAction = any; // not sure what this data is yet...

export type News = {
  title: string;
  date: FirestoreDate;
  content: string;
  author: string;
}
