import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllHomework,
  useAddHomework,
  useUpdateHomework,
  useDeleteHomework,
} from '../hooks/useQueries';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { BigActionButton } from '../components/common/BigActionButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Plus, Pencil, Trash2, Check } from 'lucide-react';
import type { Homework } from '../backend';

export default function HomeworkScreen() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: homework, isLoading, error, refetch } = useGetAllHomework();
  const addHomework = useAddHomework();
  const updateHomework = useUpdateHomework();
  const deleteHomework = useDeleteHomework();

  const [showDialog, setShowDialog] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    notes: '',
  });

  if (!identity) {
    navigate({ to: '/login' });
    return null;
  }

  const handleOpenDialog = (hw?: Homework) => {
    if (hw) {
      setEditingHomework(hw);
      const date = new Date(Number(hw.dueDate) / 1000000);
      setFormData({
        title: hw.title,
        subject: hw.subject,
        dueDate: date.toISOString().split('T')[0],
        notes: hw.notes || '',
      });
    } else {
      setEditingHomework(null);
      setFormData({ title: '', subject: '', dueDate: '', notes: '' });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dueDate = BigInt(new Date(formData.dueDate).getTime() * 1000000);

    if (editingHomework) {
      await updateHomework.mutateAsync({
        id: editingHomework.id,
        homework: {
          ...editingHomework,
          title: formData.title,
          subject: formData.subject,
          dueDate,
          notes: formData.notes || undefined,
        },
      });
    } else {
      await addHomework.mutateAsync({
        title: formData.title,
        subject: formData.subject,
        dueDate,
        notes: formData.notes || undefined,
        completed: false,
      });
    }
    setShowDialog(false);
  };

  const handleToggleComplete = async (hw: Homework) => {
    await updateHomework.mutateAsync({
      id: hw.id,
      homework: { ...hw, completed: !hw.completed },
    });
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this homework?')) {
      await deleteHomework.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <ScreenHeader title="Homework" subtitle="Keep track of your assignments" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <BigActionButton onClick={() => handleOpenDialog()} icon={Plus} className="w-full">
          Add New Homework
        </BigActionButton>

        {isLoading && <LoadingState message="Loading homework..." />}
        {error && <ErrorState message="Failed to load homework" onRetry={() => refetch()} />}
        {!isLoading && !error && homework?.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No Homework Yet"
            message="Add your first homework assignment to get started!"
          />
        )}

        {homework && homework.length > 0 && (
          <div className="space-y-3">
            {homework.map((hw) => (
              <Card key={hw.id.toString()} className="p-4 shadow-cute">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={hw.completed}
                    onCheckedChange={() => handleToggleComplete(hw)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${hw.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {hw.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{hw.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(Number(hw.dueDate) / 1000000).toLocaleDateString()}
                    </p>
                    {hw.notes && <p className="text-sm mt-2">{hw.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(hw)}
                      className="rounded-full"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(hw.id)}
                      className="rounded-full text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHomework ? 'Edit Homework' : 'Add Homework'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
                className="rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="rounded-2xl"
              />
            </div>
            <BigActionButton
              disabled={addHomework.isPending || updateHomework.isPending}
              className="w-full"
            >
              {editingHomework ? 'Update' : 'Add'} Homework
            </BigActionButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
