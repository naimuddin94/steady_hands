import { z } from 'zod';
import { FOLDER_FOR } from './folder.constant';

// Zod schema for Folder validation
const folderValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Folder name is required',
    }),
    for: z.enum(Object.values(FOLDER_FOR) as [string, ...string[]], {
      message:
        'Invalid folder type. Please choose either "portfolio" or "flash".',
    }),
  }),
});

export const FolderValidation = {
  folderValidationSchema,
};

export type TFolderPayload = z.infer<typeof folderValidationSchema.shape.body>;
