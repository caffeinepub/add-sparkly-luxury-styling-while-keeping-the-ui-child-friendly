import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllTimetableEntries,
  useAddTimetableEntry,
  useUpdateTimetableEntry,
  useDeleteTimetableEntry,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import type { TimetableEntry } from '../backend';
import { Day } from '../backend';

const DAYS: Day[] = [Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday, Day.Friday, Day.Saturday, Day.Sunday];

export default function TimetableScreen() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: entries, isLoading, error, refetch } = useGetAllTimetableEntries();
  const addEntry = useAddTimetableEntry();
  const updateEntry = useUpdateTimetableEntry();
  const deleteEntry = useDeleteTimetableEntry();

  const [showDialog, setShowDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState({
    day: Day.Monday as Day,
    subject: '',
    location: '',
    startHour: '9',
    startMinute: '0',
    endHour: '10',
    endMinute: '0',
  });

  if (!identity) {
    navigate({ to: '/login' });
    return null;
  }

  const handleOpenDialog = (entry?: TimetableEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        day: entry.day,
        subject: entry.subject,
        location: entry.location || '',
        startHour: entry.startTime.startHour.toString(),
        startMinute: entry.startTime.startMinute.toString(),
        endHour: entry.endTime.endHour.toString(),
        endMinute: entry.endTime.endMinute.toString(),
      });
    } else {
      setEditingEntry(null);
      setFormData({
        day: Day.Monday,
        subject: '',
        location: '',
        startHour: '9',
        startMinute: '0',
        endHour: '10',
        endMinute: '0',
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entryData = {
      day: formData.day,
      subject: formData.subject,
      location: formData.location || undefined,
      startTime: {
        startHour: BigInt(formData.startHour),
        startMinute: BigInt(formData.startMinute),
        endHour: BigInt(0),
        endMinute: BigInt(0),
      },
      endTime: {
        startHour: BigInt(0),
        startMinute: BigInt(0),
        endHour: BigInt(formData.endHour),
        endMinute: BigInt(formData.endMinute),
      },
    };

    if (editingEntry) {
      await updateEntry.mutateAsync({
        id: editingEntry.id,
        entry: { ...entryData, id: editingEntry.id },
      });
    } else {
      await addEntry.mutateAsync(entryData);
    }
    setShowDialog(false);
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry.mutateAsync(id);
    }
  };

  const groupedEntries = entries?.reduce((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push(entry);
    return acc;
  }, {} as Record<Day, TimetableEntry[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <ScreenHeader title="Timetable" subtitle="Plan your weekly schedule" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <BigActionButton onClick={() => handleOpenDialog()} icon={Plus} className="w-full">
          Add New Class
        </BigActionButton>

        {isLoading && <LoadingState message="Loading timetable..." />}
        {error && <ErrorState message="Failed to load timetable" onRetry={() => refetch()} />}
        {!isLoading && !error && entries?.length === 0 && (
          <EmptyState
            icon={Calendar}
            title="No Classes Yet"
            message="Add your first class to start building your timetable!"
          />
        )}

        {groupedEntries && (
          <div className="space-y-6">
            {DAYS.map((day) => {
              const dayEntries = groupedEntries[day] || [];
              if (dayEntries.length === 0) return null;

              return (
                <div key={day}>
                  <h2 className="text-xl font-bold text-primary mb-3">{day}</h2>
                  <div className="space-y-3">
                    {dayEntries.map((entry) => (
                      <Card key={entry.id.toString()} className="p-4 shadow-cute">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{entry.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {entry.startTime.startHour.toString().padStart(2, '0')}:
                              {entry.startTime.startMinute.toString().padStart(2, '0')} -{' '}
                              {entry.endTime.endHour.toString().padStart(2, '0')}:
                              {entry.endTime.endMinute.toString().padStart(2, '0')}
                            </p>
                            {entry.location && (
                              <p className="text-sm text-muted-foreground">📍 {entry.location}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(entry)}
                              className="rounded-full"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(entry.id)}
                              className="rounded-full text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Class' : 'Add Class'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="day">Day</Label>
              <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value as Day })}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.startHour}
                    onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                    placeholder="HH"
                    className="rounded-2xl"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.startMinute}
                    onChange={(e) => setFormData({ ...formData, startMinute: e.target.value })}
                    placeholder="MM"
                    className="rounded-2xl"
                  />
                </div>
              </div>
              <div>
                <Label>End Time</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.endHour}
                    onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                    placeholder="HH"
                    className="rounded-2xl"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.endMinute}
                    onChange={(e) => setFormData({ ...formData, endMinute: e.target.value })}
                    placeholder="MM"
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="rounded-2xl"
              />
            </div>
            <BigActionButton disabled={addEntry.isPending || updateEntry.isPending} className="w-full">
              {editingEntry ? 'Update' : 'Add'} Class
            </BigActionButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
