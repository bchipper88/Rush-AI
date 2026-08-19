/** The 26 National Panhellenic Conference member organizations. */
export interface NpcChapter {
  id: string;
  name: string;
  nickname: string;
  letters: string;
}

export const npcChapters: NpcChapter[] = [
  { id: 'alpha-chi-omega', name: 'Alpha Chi Omega', nickname: 'AXO', letters: 'ΑΧΩ' },
  { id: 'alpha-delta-pi', name: 'Alpha Delta Pi', nickname: 'ADPi', letters: 'ΑΔΠ' },
  { id: 'alpha-epsilon-phi', name: 'Alpha Epsilon Phi', nickname: 'AEPhi', letters: 'ΑΕΦ' },
  { id: 'alpha-gamma-delta', name: 'Alpha Gamma Delta', nickname: 'Alpha Gam', letters: 'ΑΓΔ' },
  { id: 'alpha-omicron-pi', name: 'Alpha Omicron Pi', nickname: 'AOPi', letters: 'ΑΟΠ' },
  { id: 'alpha-phi', name: 'Alpha Phi', nickname: 'A Phi', letters: 'ΑΦ' },
  { id: 'alpha-sigma-alpha', name: 'Alpha Sigma Alpha', nickname: 'ASA', letters: 'ΑΣΑ' },
  { id: 'alpha-sigma-tau', name: 'Alpha Sigma Tau', nickname: 'AST', letters: 'ΑΣΤ' },
  { id: 'alpha-xi-delta', name: 'Alpha Xi Delta', nickname: 'AZD', letters: 'ΑΞΔ' },
  { id: 'chi-omega', name: 'Chi Omega', nickname: 'Chi O', letters: 'ΧΩ' },
  { id: 'delta-delta-delta', name: 'Delta Delta Delta', nickname: 'Tri Delta', letters: 'ΔΔΔ' },
  { id: 'delta-gamma', name: 'Delta Gamma', nickname: 'DG', letters: 'ΔΓ' },
  { id: 'delta-phi-epsilon', name: 'Delta Phi Epsilon', nickname: 'DPhiE', letters: 'ΔΦΕ' },
  { id: 'delta-zeta', name: 'Delta Zeta', nickname: 'DZ', letters: 'ΔΖ' },
  { id: 'gamma-phi-beta', name: 'Gamma Phi Beta', nickname: 'Gamma Phi', letters: 'ΓΦΒ' },
  { id: 'kappa-alpha-theta', name: 'Kappa Alpha Theta', nickname: 'Theta', letters: 'ΚΑΘ' },
  { id: 'kappa-delta', name: 'Kappa Delta', nickname: 'KD', letters: 'ΚΔ' },
  { id: 'kappa-kappa-gamma', name: 'Kappa Kappa Gamma', nickname: 'Kappa', letters: 'ΚΚΓ' },
  { id: 'phi-mu', name: 'Phi Mu', nickname: 'Phi Mu', letters: 'ΦΜ' },
  { id: 'phi-sigma-sigma', name: 'Phi Sigma Sigma', nickname: 'Phi Sig', letters: 'ΦΣΣ' },
  { id: 'pi-beta-phi', name: 'Pi Beta Phi', nickname: 'Pi Phi', letters: 'ΠΒΦ' },
  { id: 'sigma-delta-tau', name: 'Sigma Delta Tau', nickname: 'SDT', letters: 'ΣΔΤ' },
  { id: 'sigma-kappa', name: 'Sigma Kappa', nickname: 'Sig Kap', letters: 'ΣΚ' },
  { id: 'sigma-sigma-sigma', name: 'Sigma Sigma Sigma', nickname: 'Tri Sigma', letters: 'ΣΣΣ' },
  { id: 'theta-phi-alpha', name: 'Theta Phi Alpha', nickname: 'Theta Phi', letters: 'ΘΦΑ' },
  { id: 'zeta-tau-alpha', name: 'Zeta Tau Alpha', nickname: 'ZTA', letters: 'ΖΤΑ' },
];

export function getNpcChapter(id: string): NpcChapter | undefined {
  return npcChapters.find((c) => c.id === id);
}

/** Vibe tags she can attach to a round — deliberately about fit, not tiers. */
export const vibeTags = [
  'easy conversation',
  'felt genuine',
  'great questions',
  'warm energy',
  'funny',
  'shared interests',
  'felt rushed',
  'hard to talk',
  'too intense',
  'loved the house',
  'philanthropy stood out',
  'could see myself here',
];
