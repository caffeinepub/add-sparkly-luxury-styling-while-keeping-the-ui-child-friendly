import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BigActionButton } from '../common/BigActionButton';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Heart } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await saveProfile.mutateAsync({ name: name.trim() });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            Welcome to My School Planner!
            <Heart className="h-6 w-6 text-primary fill-primary" />
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            What should we call you?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="h-12 text-lg rounded-2xl"
              autoFocus
            />
          </div>
          <BigActionButton
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full"
          >
            {saveProfile.isPending ? 'Saving...' : "Let's Go!"}
          </BigActionButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
