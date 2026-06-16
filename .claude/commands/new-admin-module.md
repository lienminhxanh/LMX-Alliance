---
description: Tạo admin module hoàn chỉnh với CRUD
argument-hint: <module-name>
---

# Create Admin Module: $ARGUMENTS

Create a complete admin module:

1. **Prisma Model**: Add model to `prisma/schema.prisma`
   - id, multi-language fields (VI/EN/ZH)
   - status, orderIndex, createdAt, updatedAt

2. **Server Actions**: Create `actions/$ARGUMENTS.ts`
   - createItem(formData)
   - updateItem(id, formData)
   - deleteItem(id)
   - reorderItems(items)
   - All with Zod validation
   - All with audit logging

3. **Admin Pages**: Create in `app/admin/$ARGUMENTS/`
   - `page.tsx` (list with DataTable)
   - `new/page.tsx` (create form)
   - `[id]/page.tsx` (edit form)

4. **Components**: 
   - Use MultiLanguageForm component
   - Use FileUploader for images
   - Use DragDropList for reordering

5. **Permissions**: Add to `lib/permissions.ts`
   - Define who can access

6. **Audit Logging**: All mutations logged

7. **Cache Revalidation**: revalidatePath calls

Make it production-ready!