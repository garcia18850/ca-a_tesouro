import type { TreasureClue } from '@/lib/treasure'

export function TreasureArt({ kind = 'chest', open = false, className = '' }: { kind?: TreasureClue['illustration']; open?: boolean; className?: string }) {
  return <svg viewBox="0 0 220 170" fill="none" aria-hidden="true" focusable="false" className={className}>
    <ellipse cx="110" cy="151" rx="73" ry="10" fill="#193d5414" />
    {kind === 'chest' && <>
      {open && <><path d="m47 70-14-32m55 25-4-43m42 43 13-41m18 53 29-26" stroke="#ffc849" strokeWidth="7" strokeLinecap="round" /><path d="m106 13 5 12 13 2-10 9 2 13-11-7-12 6 3-13-9-10 13-1Z" fill="#ffca48" /><circle cx="157" cy="31" r="6" fill="#f68eb1" /></>}
      <path d={open ? 'M43 81 51 47q4-16 22-16h75q18 0 23 16l8 34Z' : 'M40 89V72q0-32 32-32h76q32 0 32 32v17Z'} fill="#a779e0" stroke="#50317b" strokeWidth="5" strokeLinejoin="round" />
      <path d="M43 86h134v48q0 12-12 12H55q-12 0-12-12Z" fill="#ffc14c" stroke="#73422b" strokeWidth="5" strokeLinejoin="round" />
      <path d="M63 88v56m94-56v56" stroke="#ffda67" strokeWidth="13" /><path d="M44 104h133" stroke="#9a562d" strokeWidth="4" /><rect x="94" y="78" width="32" height="39" rx="8" fill="#ffdf70" stroke="#ad782b" strokeWidth="3" /><circle cx="110" cy="92" r="5" fill="#69422c" /><path d="M110 95v8" stroke="#69422c" strokeWidth="5" strokeLinecap="round" />
      {open && <><ellipse cx="75" cy="77" rx="15" ry="8" fill="#ffda50" stroke="#c18c2b" strokeWidth="3" /><ellipse cx="144" cy="75" rx="14" ry="8" fill="#ffda50" stroke="#c18c2b" strokeWidth="3" /><path d="m120 60 13-10 13 10-13 17Z" fill="#38c7c1" stroke="#208e9c" strokeWidth="3" /></>}
    </>}
    {kind === 'shell' && <>
      <path d="M109 137Q20 119 34 73 40 55 60 56 61 29 86 33 108 10 130 33 155 29 158 56 181 54 188 76 201 122 109 137Z" fill="#ffa77d" stroke="#b55239" strokeWidth="5" strokeLinejoin="round" /><path d="m109 136-50-75m50 75L86 38m23 98 21-98m-21 98 48-75m-48 75-71-53m71 53 72-51" stroke="#de7750" strokeWidth="4" strokeLinecap="round" /><path d="M88 132h43l-6 16H94Z" fill="#f78d66" stroke="#b55239" strokeWidth="4" />
      <circle cx="76" cy="100" r="4" fill="#8f463b" /><circle cx="142" cy="100" r="4" fill="#8f463b" /><path d="M101 114q9 8 17 0" stroke="#8f463b" strokeWidth="4" strokeLinecap="round" />
    </>}
    {kind === 'bridge' && <>
      <path d="M20 137q30-15 60 0t60 0 60 0" stroke="#60cbdc" strokeWidth="20" strokeLinecap="round" /><path d="M31 114q79-65 158 0" stroke="#a16540" strokeWidth="24" /><path d="M31 110q79-65 158 0" stroke="#efb565" strokeWidth="14" />
      <path d="M31 63v65m158-65v65M35 72q75-51 150 0" stroke="#7d573b" strokeWidth="6" strokeLinecap="round" /><path d="M62 59v32m32-42v28m32-28v28m32-17v32" stroke="#a87c4b" strokeWidth="5" /><circle cx="31" cy="59" r="7" fill="#ffc34d" /><circle cx="189" cy="59" r="7" fill="#ffc34d" />
    </>}
    {kind === 'palm' && <>
      <path d="M99 147q28-48 12-91" stroke="#a66b3d" strokeWidth="22" strokeLinecap="round" /><path d="m104 132 18 2m-12-23 17 1m-14-22 15-1" stroke="#784b31" strokeWidth="4" strokeLinecap="round" />
      <path d="M113 58Q63 7 28 54q47-3 85 4M111 58Q106-5 69 15q15 21 42 43M112 58q23-60 64-35-38 12-64 35M112 58q70-36 83 11-49-16-83-11M113 58Q65 42 47 98q42-32 66-40M113 58q42-4 49 44-27-30-49-44" fill="#43b875" stroke="#278452" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="111" cy="63" r="10" fill="#be8049" /><circle cx="129" cy="66" r="10" fill="#d69555" /><path d="M58 149h98" stroke="#f2ca64" strokeWidth="9" strokeLinecap="round" />
    </>}
    {kind === 'parrot' && <>
      <path d="m102 118-18 37 26-13 12 13 2-37" fill="#5c91d4" stroke="#315f94" strokeWidth="4" /><path d="M70 87q0-43 41-43 38 0 38 42v28q-4 26-38 26T70 114Z" fill="#39b985" stroke="#26856d" strokeWidth="4" /><path d="M106 43q-9-30 7-32l11 32m0 4q3-28 18-25l-3 32" fill="#81d99d" stroke="#26856d" strokeWidth="4" /><ellipse cx="135" cy="72" rx="24" ry="26" fill="#fff4cf" /><circle cx="140" cy="68" r="5" fill="#2e4656" /><path d="M155 77q32 2 27 23-18 0-27-7Z" fill="#f6b94a" stroke="#b97c2c" strokeWidth="4" /><path d="M78 84q-24 17-10 42 34 13 40-23" fill="#40a4d0" stroke="#3b78ab" strokeWidth="4" /><path d="M65 145h91" stroke="#a6794d" strokeWidth="8" strokeLinecap="round" /><path d="M102 137v9m19-9v9" stroke="#b57e37" strokeWidth="5" strokeLinecap="round" />
    </>}
  </svg>
}

export function IslandLandscape() {
  return <svg className="island-landscape" viewBox="0 0 440 500" aria-hidden="true" focusable="false">
    <defs><pattern id="sea-ripples" width="100" height="80" patternUnits="userSpaceOnUse"><path d="M10 25q12 7 24 0m32 30q12 7 24 0" stroke="#fff" strokeWidth="3" opacity=".45" fill="none" strokeLinecap="round" /></pattern></defs>
    <rect width="440" height="500" rx="35" fill="#65d2e3" /><rect width="440" height="500" rx="35" fill="url(#sea-ripples)" />
    <path d="M128 47q69-30 140 13t75 104q-7 41 13 80t-14 91q-7 67-76 104t-124-3q-66-12-74-65-34-26-17-76 20-39-4-84T72 108q9-42 56-61Z" fill="#2999ad" opacity=".3" transform="translate(0 9)" />
    <path d="M128 47q69-30 140 13t75 104q-7 41 13 80t-14 91q-7 67-76 104t-124-3q-66-12-74-65-34-26-17-76 20-39-4-84T72 108q9-42 56-61Z" fill="#ffdf8b" stroke="#efbd50" strokeWidth="4" />
    <path d="M143 75q59-23 114 10t57 80q-9 40 10 86t-14 77q-3 59-61 87t-99-9q-58-10-62-52-27-25-11-61 21-40 0-81t20-82q7-37 46-55Z" fill="#97d477" />
    <path d="M94 391C111 341 287 389 306 324S100 307 121 245 313 223 307 167 190 155 168 77" fill="none" stroke="#fff6cf" strokeWidth="15" strokeLinecap="round" />
    <path d="M94 391C111 341 287 389 306 324S100 307 121 245 313 223 307 167 190 155 168 77" fill="none" stroke="#ae853e" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
    <path d="M300 65q48 42 16 97t25 65" stroke="#46b7d1" strokeWidth="19" strokeLinecap="round" fill="none" />
    <path d="m62 142 8-13 9 13m-15-14 7-13 9 13M358 407l8-13 10 13m-16-14 7-13 8 13" stroke="#248b58" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="165" cy="326" r="5" fill="#f98ba1" /><circle cx="211" cy="197" r="5" fill="#f98ba1" /><circle cx="242" cy="109" r="5" fill="#ffe86f" /><circle cx="259" cy="416" r="5" fill="#f98ba1" />
    <path d="m32 62 5 12 13 2-10 9 2 13-11-7-12 6 3-13-9-10 13-1Z" fill="#fff2aa" /><path d="m386 268 4 9 10 1-7 7 1 10-8-5-9 5 2-10-7-7 10-1Z" fill="#fff2aa" />
  </svg>
}
