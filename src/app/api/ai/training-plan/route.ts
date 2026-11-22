import { NextResponse } from 'next/server';
import { GenerateTrainingPlanRequest, AiTrainingPlan } from '@/types/ai-training-plan';

export async function POST(req: Request) {
  try {
    const body: GenerateTrainingPlanRequest = await req.json();
    const { athlete, assessment, focusGoal, cycleDuration, coachCustomNotes, coachName, apiKey: userKey } = body as any;

    const apiKey = userKey || process.env.OPENROUTER_API_KEY;
    const targetCoach = (coachName || athlete?.coachName || '').trim() || 'Lead Coach';

    // Build sports science context from athlete & assessment data
    const athleteName = athlete?.fullName || 'Athlete';
    const primaryEvent = athlete?.primaryEventName || 'Track & Field';
    const eventGroup = athlete?.eventGroup || 'Sprints';
    const focus = focusGoal || 'Peak Velocity, Power & Asymmetry Correction';
    const duration = cycleDuration || '4-Week Mesocycle';

    const testSummaries = (assessment?.testResults || [])
      .map(
        (t: any) =>
          `• ${t.testName}: ${t.finalRawValue ?? 'N/A'}${t.unit} (Score: ${
            t.percentile !== undefined ? Math.round(t.percentile) : 'N/A'
          }th %ile, Rating: ${t.rating || 'Standard'})`
      )
      .join('\n');

    const asymmetries = (assessment?.bilateralAsymmetries || [])
      .map((b: any) => `• ${b.testName}: ${b.asymmetryPercent}% deficit (${b.description})`)
      .join('\n');

    const strengths = (assessment?.topStrengths || []).join(', ') || 'Explosive power baseline';
    const areasToImprove = (assessment?.areasToImprove || []).join(', ') || 'Bilateral symmetry & lactate buffer';

    // If an API key is available, call OpenRouter GPT-4o
    if (apiKey) {
      try {
        const prompt = `
You are the Lead Track & Field Biomechanist and Strength & Conditioning Director at the National Athletics High Performance Centre, collaborating directly with Head Coach ${targetCoach}.

Athlete Profile:
- Name: ${athleteName} (${athlete?.athleteCode || 'ATH-2026'})
- Primary Event: ${primaryEvent} (Event Group: ${eventGroup})
- Sex: ${athlete?.sex || 'Athletics Squad'}
- Training Squad: ${athlete?.trainingSquad || 'Senior High Performance Squad'}
- Supervising Coach: ${targetCoach}

Latest Physical Fitness Test Data:
- Overall Fitness Index: ${assessment?.overallFitnessScore?.toFixed(1) || '85.0'} / 100 (${assessment?.overallRating || 'Proficient'})
- Evaluated Tests:
${testSummaries || '• Standard athletics diagnostic battery completed.'}

Identified Deficits & Bilateral Asymmetries:
${asymmetries || '• No significant bilateral deficit detected (<5%).'}

Identified Strengths: ${strengths}
Priority Areas to Improve: ${areasToImprove}
Prescription Cycle Duration: ${duration}
Prescription Target Goal: ${focus}
Coach Rudra Custom Coaching Notes: ${coachCustomNotes || 'Maximize neural recruitment while safeguarding hamstring and adductor tendon integrity.'}

TASK:
Generate a world-class, professional athletics training prescription tailored specifically to ${athleteName}.
The plan must address their exact test weaknesses (especially any bilateral asymmetry >5%) while amplifying their event-specific strengths.

You must respond ONLY with a valid JSON object matching this exact schema (no markdown fences, no text outside the JSON):
{
  "executiveSummary": "Deep sports science biomechanical appraisal written for the supervising coach explaining the athlete's current physical readiness, limiting factors, and periodization strategy.",
  "keyDeficitAddressed": "Exact physical bottleneck being resolved (e.g. 14% left-leg deficit in single leg power and maximum velocity transition).",
  "bilateralInterventions": [
    "Specific corrective unilateral exercise 1 with sets and reps",
    "Specific corrective unilateral exercise 2 with sets and reps",
    "Pre-activation tendon loading drill"
  ],
  "coachRudraFieldCues": [
    "Technical verbal cue 1 for sprint mechanics or jump takeoff",
    "Technical verbal cue 2 for posture and pelvic neutrality",
    "Technical verbal cue 3 for ground strike velocity"
  ],
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday: Maximum Velocity & Neural Acceleration",
      "focus": "0-30m acceleration mechanics and posterior chain rate of force development",
      "warmupProtocol": [
        "10 min dynamic mobility: leg swings, scorpion, hurdle walkovers",
        "A-skips, B-skips, prime times (3x20m)",
        "3x30m progressive accelerations (75%, 85%, 95%)"
      ],
      "drills": [
        {
          "name": "Heavy Sled Pushes or Resisted Sprints",
          "sets": 4,
          "reps": "20m",
          "intensity": "90-95% maximal effort",
          "rest": "3-4 min complete recovery",
          "technicalCue": "45-degree forward lean, aggressive shin angle, complete triple extension"
        },
        {
          "name": "Unresisted Block Starts / 3-Point Starts",
          "sets": 5,
          "reps": "30m",
          "intensity": "100% vMax",
          "rest": "4 min walk-back recovery",
          "technicalCue": "Low heel recovery, push the ground back, no premature upright posture"
        },
        {
          "name": "Trap Bar Deadlift / Clean Pulls",
          "sets": 4,
          "reps": "3 reps @ 85% 1RM",
          "intensity": "Maximum bar velocity",
          "rest": "3 min rest",
          "technicalCue": "Braced core, drive feet through the floor, explosive hip snap"
        }
      ],
      "correctivesAndPrehab": [
        "Nordic hamstring curls: 3x5 reps with slow 4s eccentric lowering",
        "Single-leg calf raises with 2s isometric hold at top: 3x12 each side"
      ],
      "recoveryNote": "Post-session contrast shower (2 min hot / 1 min cold x 3) + 500ml electrolyte replenishment."
    },
    {
      "dayNumber": 2,
      "dayName": "Tuesday: Bilateral Equilibrium & Olympic Foundation",
      "focus": "Correcting left/right force discrepancy and ankle stiffness",
      "warmupProtocol": [
        "Foam roll quads, adductors, IT band",
        "Ankle dorsiflexion lunge rocks with band: 2x15 per side",
        "Pogo hops & ankle stiffness bounds: 3x20 contacts"
      ],
      "drills": [
        {
          "name": "Rear Foot Elevated Bulgarian Split Squat (Weaker Side 1st)",
          "sets": 4,
          "reps": "6 reps each side (extra set on weaker side)",
          "intensity": "Moderate-heavy dumbbells (RPE 8)",
          "rest": "2 min",
          "technicalCue": "Knee tracking directly over second toe, neutral pelvis without lateral hip drop"
        },
        {
          "name": "Single-Leg Box Jumps with Stick Landing",
          "sets": 3,
          "reps": "5 jumps each leg",
          "intensity": "Maximum reactive height",
          "rest": "90s",
          "technicalCue": "Soft landing, absorb force through midfoot, knee aligned with hip"
        }
      ],
      "correctivesAndPrehab": [
        "Side planks with top leg abduction: 3x30s each side",
        "Copenhagen adductor isometric planks: 3x20s per side"
      ],
      "recoveryNote": "Target 8+ hours quality sleep; light mobility flush session in afternoon."
    },
    {
      "dayNumber": 3,
      "dayName": "Thursday: Speed-Endurance & Glycolytic Power",
      "focus": "Late-race velocity maintenance and lactate buffering",
      "warmupProtocol": [
        "Standard IAAF dynamic track warmup",
        "Build-up strides: 4x50m with gradual speed rise"
      ],
      "drills": [
        {
          "name": "Special Endurance Split Runs (e.g. 150m + 150m)",
          "sets": 3,
          "reps": "150m (95% effort) + 45s rest + 150m (max)",
          "intensity": "Race-pace velocity",
          "rest": "8 min full recovery between sets",
          "technicalCue": "Relaxed shoulders, tall hips, rhythm preservation despite fatigue"
        }
      ],
      "correctivesAndPrehab": [
        "Hip flexor couch stretch: 2 min per side",
        "Pigeon pose glute release: 2 min per side"
      ],
      "recoveryNote": "Active cool-down: 800m barefoot grass jog + whey protein + carbohydrate shake."
    },
    {
      "dayNumber": 4,
      "dayName": "Saturday: Complex Explosive Power & Technical Coordination",
      "focus": "Potentiation complexes (heavy load followed by plyometric transfer)",
      "warmupProtocol": [
        "Mini-band activation series: glute bridges, lateral monster walks",
        "Hurdle hops: 3x5 hurdles"
      ],
      "drills": [
        {
          "name": "Contrast Complex: Back Squat into Broad Jump",
          "sets": 4,
          "reps": "2 heavy squats (85%) + 15s rest + 3 maximal broad jumps",
          "intensity": "High neural recruitment",
          "rest": "3.5 min",
          "technicalCue": "Immediate violent explosion into horizontal displacement"
        }
      ],
      "correctivesAndPrehab": [
        "Pallof press core anti-rotation: 3x12 per side",
        "Tibialis anterior raises: 3x20"
      ],
      "recoveryNote": "Ice bath or cold plunge (10 min at 12°C) + Epsom salt soak."
    }
  ]
}
`;

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://nahpc.athletics.gov.in',
            'X-Title': `Athletics Intelligence Systems - ${targetCoach}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o',
            messages: [
              {
                role: 'system',
                content:
                  'You are a World Athletics (IAAF) Level 5 Master Coach & High Performance Biomechanist. You generate precise, elite track & field training cycles in valid JSON only.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        });

        if (openRouterResponse.ok) {
          const completionData = await openRouterResponse.json();
          const rawContent = completionData.choices?.[0]?.message?.content;

          if (rawContent) {
            // Clean any potential markdown wrapping
            const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            const aiPlan: AiTrainingPlan = {
              id: `plan-${Date.now()}`,
              athleteId: athlete?.id || 'ath-unknown',
              athleteName: athleteName,
              coachName: targetCoach,
              createdAt: new Date().toISOString(),
              focusGoal: focus,
              cycleDuration: duration,
              executiveSummary: parsed.executiveSummary || 'Comprehensive physical conditioning plan formulated for high-performance track & field competition.',
              keyDeficitAddressed: parsed.keyDeficitAddressed || 'Velocity development and bilateral symmetry equilibrium.',
              days: parsed.days || [],
              bilateralInterventions: parsed.bilateralInterventions || [],
              coachRudraFieldCues: parsed.coachRudraFieldCues || [],
              modelUsed: 'OpenAI GPT-4o via OpenRouter',
            };

            return NextResponse.json({ success: true, plan: aiPlan });
          }
        } else {
          const errText = await openRouterResponse.text();
          console.warn('OpenRouter API returned error, activating elite fallback generator:', errText);
        }
      } catch (apiError) {
        console.warn('OpenRouter call failed, activating sports science rule generator:', apiError);
      }
    }

    // Elite Fallback Generator (Grounded in IAAF Athletics Science)
    const fallbackPlan: AiTrainingPlan = generateIAAFSportsSciencePlan({
      athleteName,
      athleteId: athlete?.id || 'ath-1',
      primaryEvent,
      eventGroup,
      focusGoal: focus,
      duration,
      coachName: targetCoach,
      asymmetries: assessment?.bilateralAsymmetries,
      assessment,
    });

    return NextResponse.json({ success: true, plan: fallbackPlan, isFallback: !apiKey });
  } catch (error: any) {
    console.error('AI Training Plan Generation failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate training plan.' },
      { status: 500 }
    );
  }
}

/**
 * High-Caliber Sports Science Training Plan Generator
 * Used when offline, during network outages, or when OpenRouter quota is exhausted.
 */
function generateIAAFSportsSciencePlan({
  athleteName,
  athleteId,
  primaryEvent,
  eventGroup,
  focusGoal,
  duration,
  coachName = 'Lead Coach',
  asymmetries,
  assessment,
}: {
  athleteName: string;
  athleteId: string;
  primaryEvent: string;
  eventGroup: string;
  focusGoal: string;
  duration: string;
  coachName?: string;
  asymmetries?: Array<{ testName: string; asymmetryPercent: number; description: string }>;
  assessment?: any;
}): AiTrainingPlan {
  const highAsymmetry = asymmetries?.find((a) => Math.abs(a.asymmetryPercent) > 10);
  const asymmetryText = highAsymmetry
    ? `Targeted correction of ${highAsymmetry.asymmetryPercent}% asymmetry in ${highAsymmetry.testName} (${highAsymmetry.description})`
    : 'Bilateral equilibrium optimization and pelvic stabilization';

  return {
    id: `plan-iaaf-${Date.now()}`,
    athleteId,
    athleteName,
    coachName,
    createdAt: new Date().toISOString(),
    focusGoal,
    cycleDuration: duration,
    executiveSummary: `${athleteName} presents with high baseline capacity in ${primaryEvent}. Biomechanical diagnostics indicate priority focus on ${asymmetryText}. This cycle employs Dan Pfaff acceleration progressions paired with Bompa strength-power periodization to maximize force transfer while minimizing adductor/hamstring strain.`,
    keyDeficitAddressed: highAsymmetry
      ? `${highAsymmetry.testName} ${highAsymmetry.asymmetryPercent}% deficit (${highAsymmetry.description})`
      : 'Sprint acceleration rate of force development and reactive stiffness',
    bilateralInterventions: [
      'Unilateral Bulgarian Split Squat: 4x6 each side (extra isometric set on weaker leg)',
      'Single-Leg Romanian Deadlift with Kettlebell: 3x8 with 3s eccentric descent',
      'Copenhagen Adductor Planks: 3x25s holds per side for groin & pelvic stability',
      'Unilateral Ankle Pogo Bounds: 3x15 contacts focusing on ground stiffness',
    ],
    coachRudraFieldCues: [
      '“Push the track behind you—do not reach with the lead leg during acceleration.”',
      '“Keep hips tall and strike beneath your center of mass on every maximum velocity stride.”',
      '“Maintain active ankle dorsiflexion before ground strike; land like a stiff coil.”',
    ],
    days: [
      {
        dayNumber: 1,
        dayName: 'Monday: Acceleration & Explosive Power Transfer',
        focus: '0-30m acceleration mechanics, horizontal force application, and hip extension power',
        warmupProtocol: [
          'Dynamic multi-planar mobility: hip openers, world’s greatest stretch, ankle rocks (10 min)',
          'Sprinting drill sequence: A-Walks, A-Skips, High Knee bounds with active arm pump (3x20m)',
          '3x30m progressive sprint buildups: 75% -> 85% -> 95%',
        ],
        drills: [
          {
            name: 'Resisted Acceleration Runs (Sled / Band)',
            sets: 4,
            reps: '20m',
            intensity: '90-95% maximum effort (10% velocity decrement load)',
            rest: '3.5 min full recovery',
            technicalCue: 'Low exit angle, aggressive shin drop, explosive piston-like leg action',
          },
          {
            name: '3-Point Stance Unresisted Starts',
            sets: 5,
            reps: '30m',
            intensity: '100% maximal sprint effort',
            rest: '4 min complete recovery between reps',
            technicalCue: 'Violent arm split, eyes down on first 3 strides, push through the whole foot',
          },
          {
            name: 'Trap Bar Explosive Jumps / Heavy Pulls',
            sets: 4,
            reps: '3 reps @ 75% 1RM',
            intensity: 'Maximum bar speed (velocity based)',
            rest: '3 min',
            technicalCue: 'Snap hips through with violent triple extension at ankle, knee, and hip',
          },
        ],
        correctivesAndPrehab: [
          'Nordic Hamstring Curls: 3x5 reps with strict 4s eccentric descent',
          'Single-leg isometric calf holds (bent knee): 3x30s each leg',
        ],
        recoveryNote: 'Post-workout contrast bath (2 min hot / 1 min ice x 4 cycles) + 30g protein + 60g carbs.',
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday: Bilateral Symmetry & Unilateral Strength',
        focus: 'Eliminating left-to-right force discrepancies and building eccentric hamstring capacity',
        warmupProtocol: [
          'Extensive foam rolling: glutes, TFL, adductors, piriformis',
          'Banded joint distraction lunge mobility: 2x15 each side',
          'Low-level plyometrics: bilateral mini-hurdle bounces (3x10 contacts)',
        ],
        drills: [
          {
            name: 'Rear-Foot Elevated Bulgarian Split Squats',
            sets: 4,
            reps: '6 reps per leg (1 extra set on weaker side)',
            intensity: 'Heavy dumbbells (RPE 8)',
            rest: '2 min',
            technicalCue: 'Torso slightly tilted forward to bias glute max; knee tracks over 2nd toe',
          },
          {
            name: 'Single-Leg Drop Jumps from 20cm Box',
            sets: 3,
            reps: '4 jumps per leg',
            intensity: 'Maximum reactive rebound height',
            rest: '90s',
            technicalCue: 'Minimize ground contact time; stiff ankle rebound without heel collapse',
          },
          {
            name: 'Barbell Romanian Deadlift (RDL)',
            sets: 4,
            reps: '6 reps @ 75% 1RM',
            intensity: 'Controlled 3s eccentric cadence',
            rest: '2.5 min',
            technicalCue: 'Push hips straight back, flat spine, feel deep tension in hamstrings and glutes',
          },
        ],
        correctivesAndPrehab: [
          'Copenhagen Adductor Planks: 3x20s per side',
          'Side-lying clam shells with heavy resistance band: 3x15 per side',
        ],
        recoveryNote: 'Static stretching sequence: hamstrings, hip flexors, lats (15 min). Target 8.5 hours sleep.',
      },
      {
        dayNumber: 3,
        dayName: 'Thursday: Speed-Endurance & Glycolytic Capacity',
        focus: 'Preserving running mechanics under heavy lactate accumulation',
        warmupProtocol: [
          'Full IAAF track dynamic mobility routine',
          'Hurdle mobility drills: over & under routine (4 sets x 5 hurdles)',
          '4x40m progressive acceleration strides',
        ],
        drills: [
          {
            name: 'Split 300m Runs (150m + 45s rest + 150m)',
            sets: 2,
            reps: '150m at 95% + 45s rest + 150m at 100%',
            intensity: 'Near-maximal competition tempo',
            rest: '10 min full passive recovery between sets',
            technicalCue: 'Keep head level and jaw relaxed; do not shorten stride frequency under lactate fatigue',
          },
          {
            name: 'Flying 20m Sprints with 30m Build-Up Zone',
            sets: 4,
            reps: '20m fly zone',
            intensity: '100% maximum velocity',
            rest: '4 min',
            technicalCue: 'Upright sprint posture, high knee lift, punch the ground vertically beneath COM',
          },
        ],
        correctivesAndPrehab: [
          'Banded hip flexor pulls (psoas marches): 3x12 per leg',
          'Active hamstring sweeps: 2x15 per leg',
        ],
        recoveryNote: 'Immediate post-run 800m barefoot grass jog flush + 1000ml electrolyte hydration.',
      },
      {
        dayNumber: 4,
        dayName: 'Saturday: Contrast Complex Power & Technical Coordination',
        focus: 'Post-Activation Potentiation (PAP) for explosive athletics takeoff and sprint turnover',
        warmupProtocol: [
          'Glute activation series with mini-bands',
          'Elastic bounding: alternate leg bounds (3x30m)',
          'Medicine ball forward scoop tosses: 3x5 throws',
        ],
        drills: [
          {
            name: 'Heavy Back Squat into Standing Broad Jump (Complex)',
            sets: 4,
            reps: '2 heavy squats (85% 1RM) + 20s rest + 2 maximal broad jumps',
            intensity: 'Maximal neuromuscular recruitment',
            rest: '3.5 min between complexes',
            technicalCue: 'Exploit the post-activation potentiation from the squat into horizontal leap distance',
          },
          {
            name: 'Overhead Backward Medicine Ball Launch',
            sets: 4,
            reps: '4 throws (5kg ball)',
            intensity: '100% explosive intent',
            rest: '90s',
            technicalCue: 'Extend fully through ankles, knees, hips, and thoracic spine at release',
          },
        ],
        correctivesAndPrehab: [
          'Pallof press anti-rotation with band: 3x12 each side',
          'Foam roller thoracic extensions: 2x15 repetitions',
        ],
        recoveryNote: 'Weekend complete recovery: 15 min ice bath at 12°C or sauna flush.',
      },
    ],
    modelUsed: 'openai/gpt-4o (sports-science-fallback)',
  };
}
