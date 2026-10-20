import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet } from '@/components/ui/Sheet';
import { showSnackbar } from '@/components/ui/Snackbar';
import { TextField } from '@/components/ui/TextField';

import { deleteTag, getTag, renameTag, restoreTag } from '../queries';

/** Rename or delete a tag. */
export function TagSheet({ tagId }: { tagId: string }) {
  const { t } = useTranslation();
  const [existing] = useState(() => getTag(tagId));
  const [name, setName] = useState(existing?.name ?? '');

  const save = () => {
    renameTag(tagId, name);
    router.back();
  };

  const remove = () => {
    deleteTag(tagId);
    router.back();
    showSnackbar(t('tags.deleted'), { label: t('common.undo'), onPress: () => restoreTag(tagId) });
  };

  return (
    <Sheet
      title={t('tags.editTitle')}
      right={
        <IconButton Icon={Trash2} label={t('tags.delete')} onPress={remove} variant="danger" />
      }
    >
      <TextField
        autoCapitalize="none"
        value={name}
        onChangeText={setName}
        placeholder={t('tags.placeholder')}
      />
      <Button label={t('common.save')} onPress={save} disabled={!name.trim()} />
    </Sheet>
  );
}
