'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { subjects, subjectsColors } from '@/constants';
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { ReactNode } from 'react';

const SubjectFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSubject = searchParams.get('subject') || '';

  const handleSubjectChange = (value: string) => {
    if (value === 'all') {
      // If selecting "All Subjects", remove the filter
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['subject'],
      });
      router.push(newUrl, { scroll: false });
    } else {
      // Otherwise, set the new subject filter
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'subject',
        value,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  // Custom component to render the selected value with color indicator
  const CustomSelectValue = () => {
    if (!currentSubject) {
      return (
        <div className='flex items-center gap-2'>
          <Image src='/icons/search.svg' alt='filter' width={15} height={15} />
          <span>Subject</span>
        </div>
      );
    }

    return (
      <div className='flex items-center gap-2'>
        <span
          className='w-3 h-3 rounded-full'
          style={{
            backgroundColor:
              subjectsColors[currentSubject as keyof typeof subjectsColors] ||
              '#CCCCCC',
          }}
        />
        <span className='capitalize'>{currentSubject}</span>
      </div>
    );
  };

  // Custom component to render each item with color indicator
  const CustomSelectItem = ({
    value,
    children,
  }: {
    value: string;
    children: ReactNode;
  }) => {
    if (value === 'all') {
      return <SelectItem value={value}>{children}</SelectItem>;
    }

    return (
      <SelectItem value={value} className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <span
            className='w-3 h-3 rounded-full'
            style={{
              backgroundColor:
                subjectsColors[value as keyof typeof subjectsColors] ||
                '#CCCCCC',
            }}
          />
          <span className='capitalize'>{children}</span>
        </div>
      </SelectItem>
    );
  };

  return (
    <Select value={currentSubject || 'all'} onValueChange={handleSubjectChange}>
      <SelectTrigger className='border border-black rounded-lg px-3 py-2 h-fit'>
        <CustomSelectValue />
      </SelectTrigger>
      <SelectContent>
        <CustomSelectItem value='all'>All Subjects</CustomSelectItem>
        {subjects.map((subject) => (
          <CustomSelectItem key={subject} value={subject}>
            {subject}
          </CustomSelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
