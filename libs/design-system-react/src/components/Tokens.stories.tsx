import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = { title: 'React/📐 Design Tokens', tags: ['autodocs'] };
export default meta;

const COLORS = [
  ['Primary',        '--ds-primary'       ],['Primary hover', '--ds-primary-hover' ],
  ['Secondary',      '--ds-secondary'     ],['Accent',        '--ds-accent'        ],
  ['Muted',          '--ds-muted'         ],['Destructive',   '--ds-destructive'   ],
  ['Success',        '--ds-success'       ],['Background',    '--ds-background'    ],
  ['Surface',        '--ds-surface'       ],['Border',        '--ds-border'        ],
  ['Topbar',         '--ds-topbar'        ],['Topbar FG',     '--ds-topbar-fg'     ],
  ['Cat Restaurant', '--ds-cat-restaurant'],['Cat Hotel',     '--ds-cat-hotel'     ],
  ['Cat Park',       '--ds-cat-park'      ],['Cat Hospital',  '--ds-cat-hospital'  ],
  ['Cat Custom',     '--ds-cat-custom'    ],
];

export const Colors: StoryObj = {
  render: () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 'var(--ds-text-lg)', fontWeight: 'var(--ds-font-semibold)', marginBottom: 16, marginTop: 0 }}>Color Tokens</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {COLORS.map(([name, token]) => (
          <div key={token}>
            <div style={{ height: 48, borderRadius: 'var(--ds-radius-md)', background: `var(${token})`, border: '1px solid var(--ds-border)', marginBottom: 6 }} />
            <p style={{ fontSize: 12, fontWeight: 500, margin: '0 0 2px' }}>{name}</p>
            <code style={{ fontSize: 10, color: 'var(--ds-muted-fg)', fontFamily: 'monospace' }}>{token}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: StoryObj = {
  render: () => (
    <div style={{ padding: 24, background: 'var(--ds-background)' }}>
      <h2 style={{ fontSize: 'var(--ds-text-lg)', fontWeight: 'var(--ds-font-semibold)', marginBottom: 16, marginTop: 0 }}>Shadow Tokens</h2>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[['Card','--ds-shadow-card'],['Topbar','--ds-shadow-topbar'],['Modal','--ds-shadow-modal'],['FAB','--ds-shadow-fab']].map(([name, token]) => (
          <div key={token} style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 80, background: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-md)', boxShadow: `var(${token})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--ds-muted-fg)' }}>{name}</span>
            </div>
            <code style={{ fontSize: 10, color: 'var(--ds-muted-fg)', fontFamily: 'monospace' }}>{token}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 'var(--ds-text-lg)', fontWeight: 'var(--ds-font-semibold)', marginTop: 0 }}>Typography Scale</h2>
      {[
        ['xl  — Dialog titles',    'var(--ds-text-xl)',   'var(--ds-font-semibold)', 'Edit POI'        ],
        ['lg  — Section headings', 'var(--ds-text-lg)',   'var(--ds-font-semibold)', 'My POIs'         ],
        ['md  — Form labels',      'var(--ds-text-md)',   'var(--ds-font-medium)',   'Name *'          ],
        ['base— Body / POI names', 'var(--ds-text-base)', 'var(--ds-font-normal)',   'Le Procope'      ],
        ['sm  — Captions',         'var(--ds-text-sm)',   'var(--ds-font-normal)',   'Restaurant'      ],
        ['xs  — Coords / meta',    'var(--ds-text-xs)',   'var(--ds-font-normal)',   '48.8534, 2.3387' ],
      ].map(([label, size, weight, text]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <code style={{ width: 220, fontSize: 11, color: 'var(--ds-muted-fg)', fontFamily: 'monospace', flexShrink: 0 }}>{label}</code>
          <span style={{ fontSize: size, fontWeight: weight }}>{text}</span>
        </div>
      ))}
    </div>
  ),
};
