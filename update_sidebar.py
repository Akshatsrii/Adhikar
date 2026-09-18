import re

with open('frontend/src/routes/__root.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''{user.role === 'admin' && (
              <>
                <Link
                  to="/admin/regulatory"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-white [&.active]:text-[var(--color-govgreen)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
                >
                  <span>⚖️</span>
                  Regulatory Admin
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-white [&.active]:text-[var(--color-govgreen)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
                >
                  <span>⚙️</span>
                  Admin Dashboard
                </Link>
              </>
            )}'''

pattern = re.compile(r'\{user\.role === \'admin\' && \(\s*<Link\s*to=\"/admin/regulatory\".*?</Link>\s*\)\}', re.DOTALL)
new_code = pattern.sub(replacement, code)

with open('frontend/src/routes/__root.tsx', 'w', encoding='utf-8') as f:
    f.write(new_code)
