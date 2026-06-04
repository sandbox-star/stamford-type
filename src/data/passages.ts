import type { Passage } from '../game/types'

/**
 * AQA Politics — Government and Politics of the USA + comparative themes.
 * Passages double as revision: dense with the proper nouns and terms that
 * are easy to misspell (e.g. "filibuster", "bicameral", "incumbency").
 */
export const PASSAGES: Passage[] = [
  {
    id: 'us-constitution',
    title: 'The US Constitution',
    topic: 'US Constitution',
    difficulty: 1,
    text: `The US Constitution is a codified document that establishes the framework of government. It is entrenched, meaning it can only be amended through a deliberately difficult process requiring supermajorities. The principle of separation of powers divides authority between the legislature, the executive and the judiciary, while checks and balances ensure that no single branch becomes dominant. Federalism distributes sovereignty between the national government and the fifty states.`,
  },
  {
    id: 'congress',
    title: 'Congress',
    topic: 'US Legislature',
    difficulty: 2,
    text: `Congress is the bicameral legislature of the United States, comprising the House of Representatives and the Senate. The House is apportioned by population, whereas each state elects two senators regardless of size. A bill must pass both chambers in identical form before being presented to the president. In the Senate, the filibuster allows a minority to obstruct legislation unless sixty senators vote for cloture. Incumbency advantage and partisan gerrymandering have contributed to declining electoral competitiveness.`,
  },
  {
    id: 'presidency',
    title: 'The Presidency',
    topic: 'US Executive',
    difficulty: 2,
    text: `The president is both head of state and head of government, exercising considerable executive authority. Formal powers include vetoing legislation, nominating federal judges and acting as commander-in-chief of the armed forces. However, the president must often rely on persuasion and bargaining to achieve legislative goals, particularly during periods of divided government. Executive orders allow the president to direct the federal bureaucracy without congressional approval, though such orders remain subject to judicial review.`,
  },
  {
    id: 'supreme-court',
    title: 'The Supreme Court',
    topic: 'US Judiciary',
    difficulty: 3,
    text: `The Supreme Court is the highest appellate court in the United States and the ultimate arbiter of constitutional interpretation. Through the power of judicial review, established in Marbury versus Madison, the Court may strike down legislation it deems unconstitutional. Justices are nominated by the president and confirmed by the Senate, serving lifetime tenure to insulate them from political pressure. Debates persist between proponents of judicial activism and advocates of judicial restraint regarding the proper role of unelected judges in a democracy.`,
  },
  {
    id: 'comparative',
    title: 'Comparative Politics',
    topic: 'Comparative (UK vs US)',
    difficulty: 3,
    text: `Comparative analysis reveals significant structural differences between the United Kingdom and the United States. The United Kingdom possesses an uncodified constitution and a fusion of powers, in which the executive is drawn from and accountable to the legislature. By contrast, the United States maintains a rigid separation of powers underpinned by a codified, entrenched constitution. Whereas parliamentary sovereignty theoretically permits Westminster to legislate without limit, American government operates within a framework of constitutional supremacy enforced by the judiciary.`,
  },
  {
    id: 'democracy-participation',
    title: 'Democracy and Participation',
    topic: 'Core Concepts',
    difficulty: 1,
    text: `Democracy rests upon the principle that legitimate authority derives from the consent of the governed. Representative democracy entrusts elected officials with decision-making, whereas direct democracy enables citizens to participate immediately through referendums and initiatives. Pluralism holds that power is dispersed among competing groups, ensuring that no single interest can dominate. Concerns about a participation crisis, declining turnout and growing political apathy have prompted debate about the health of contemporary liberal democracies.`,
  },
]

export function passageForMatchday(matchday: number): Passage {
  return PASSAGES[(matchday - 1) % PASSAGES.length]
}
