import re

with open('backend/src/routes/admin.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Add AuditLogModel import
text = text.replace(
    "import { UserModel } from '../models/User.js'",
    "import { UserModel } from '../models/User.js'\nimport { AuditLogModel } from '../models/AuditLog.js'"
)

def insert_log(action, target_expr):
    return f"""
    await AuditLogModel.create({{
      adminId: req.userId,
      action: '{action}',
      target: {target_expr},
      ip: req.ip
    }})
    """

# 1. /users/:id/role
text = re.sub(
    r"(adminRouter\.put\('/users/:id/role',.*?)(res\.json\(user\))",
    lambda m: m.group(1) + insert_log('change_user_role', '`user:${req.params.id}`') + m.group(2),
    text,
    flags=re.DOTALL
)

# 2. POST /schemes
text = re.sub(
    r"(adminRouter\.post\('/schemes',.*?)(res\.status\(201\)\.json\(await response\.json\(\)\))",
    lambda m: m.group(1) + insert_log('create_scheme', 'req.body.slug || `unknown`') + m.group(2),
    text,
    flags=re.DOTALL
)

# 3. PUT /schemes/:slug
text = re.sub(
    r"(adminRouter\.put\('/schemes/:slug',.*?)(res\.json\(await response\.json\(\)\))",
    lambda m: m.group(1) + insert_log('update_scheme', '`scheme:${req.params.slug}`') + m.group(2),
    text,
    flags=re.DOTALL
)

# 4. DELETE /schemes/:slug
text = re.sub(
    r"(adminRouter\.delete\('/schemes/:slug',.*?)(res\.json\(await response\.json\(\)\))",
    lambda m: m.group(1) + insert_log('delete_scheme', '`scheme:${req.params.slug}`') + m.group(2),
    text,
    flags=re.DOTALL
)

# 5. POST /schemes/bulk
text = re.sub(
    r"(adminRouter\.post\('/schemes/bulk',.*?)(res\.status\(201\)\.json\(await response\.json\(\)\))",
    lambda m: m.group(1) + insert_log('bulk_upload_schemes', '`bulk`') + m.group(2),
    text,
    flags=re.DOTALL
)

# 6. approve
text = re.sub(
    r"(adminRouter\.post\('/regulatory/changes/:id/approve',.*?)(res\.status\(200\)\.json\(\{ \.\.\.result, notifications_created: notified \}\))",
    lambda m: m.group(1) + insert_log('approve_change', '`regulatory_change:${req.params.id}`') + m.group(2),
    text,
    flags=re.DOTALL
)

# 7. reject
text = re.sub(
    r"(adminRouter\.post\('/regulatory/changes/:id/reject',.*?)(res\.status\(200\)\.json\(await response\.json\(\)\))",
    lambda m: m.group(1) + insert_log('reject_change', '`regulatory_change:${req.params.id}`') + m.group(2),
    text,
    flags=re.DOTALL
)

# Fix req.params.id issue in approve
text = text.replace("const change = z\n      .array(changeSchema)\n      .parse(items)\n      .find((c) => c.id === Number(req.params.id))", 
                    "const changeId = Number(req.params.id)\n    const change = z\n      .array(changeSchema)\n      .parse(items)\n      .find((c) => c.id === changeId)")

with open('backend/src/routes/admin.ts', 'w', encoding='utf-8') as f:
    f.write(text)
