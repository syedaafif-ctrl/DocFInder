'use client';

import React from 'react';
import BookingModal from '@/components/BookingModal';

export default function BookingWidget(props: any) {
  return (
    <BookingModal
      doctor={props.doctor}
      hospital={props.hospitalName ? { id: props.chamber?.hospitalId || '', name: props.hospitalName } : null}
      initialChamberId={props.chamber?.id}
      isOpen={true}
      onClose={props.onClose}
    />
  );
}