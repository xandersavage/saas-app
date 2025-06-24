'use client';

import { cn, configureAssistant, getSubjectColor } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';
import { addToSessionHistory } from '@/lib/actions/companions.actions';

enum CallStatus {
  INACTIVE,
  CONNECTING,
  ACTIVE,
  FINISHED,
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      // addToSessionHistory
      addToSessionHistory(companionId);
    };

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);

    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.error('Vapi error:', error);
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
    };
  }, []);

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    const assistantOverrides = {
      variableValues: { subject, topic, style },
      clientMessages: ['transcript'],
      serverMessages: [],
    };

    try {
      // @ts-expect-error typescript error
      await vapi.start(configureAssistant(voice, style), assistantOverrides);
    } catch (error) {
      console.error('Error starting vapi session:', error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <section className={`flex flex-col h-[70vh]`}>
      <section className={`flex gap-8 max-sm:flex-col`}>
        <div className={`companion-section`}>
          <div
            className={`companion-avatar`}
            style={{
              backgroundColor: getSubjectColor(subject),
            }}
          >
            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? 'opacity-1001'
                  : 'opacity-0',
                callStatus === CallStatus.CONNECTING &&
                  'opacity-100 animate-pulse'
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className={`max-sm:w-[80px] max-sm:h-[80px]`}
              />
            </div>
            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className={`companion-lottie`}
              />
            </div>
          </div>
          <p className={`font-bold text-2xl`}>{name}</p>
        </div>

        <div className={`user-section`}>
          <div className={`user-avatar`}>
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className={`rounded-lg`}
            />
            <p className={`font-bold text-2xl`}>{userName}</p>
          </div>
          <button
            disabled={callStatus !== CallStatus.ACTIVE}
            className={`btn-mic`}
            onClick={toggleMicrophone}
          >
            <Image
              src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
              alt={`mic`}
              width={36}
              height={36}
            />
            <p
              className={`max-sm:hidden ${isMuted ? 'text-red-500' : 'text-black'}`}
            >
              {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
            </p>
          </button>
          <button
            className={cn(
              'rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
              {
                'bg-red-500': callStatus === CallStatus.ACTIVE,
                'bg-green-500': callStatus === CallStatus.INACTIVE,
                'bg-gray-500 animate-pulse':
                  callStatus === CallStatus.CONNECTING,
              }
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? 'End Session'
              : callStatus === CallStatus.CONNECTING
                ? 'Connecting...'
                : 'Start Session'}
          </button>
        </div>
      </section>
      <section className={`transcript`}>
        <div className={`transcript-message no-scrollbar`}>
          {messages.length === 0 ? (
            <p className='text-center text-gray-500'>
              No messages yet. Start a session to begin chatting.
            </p>
          ) : (
            messages.map((message, index) => {
              if (message.role === 'assistant') {
                return (
                  <p
                    key={index}
                    className={`max-sm:text-sm p-2 rounded-lg bg-gray-100`}
                  >
                    <span className='font-bold'>
                      {name.split('')[0].replace('/[.,]/g ', '')}
                    </span>
                    : {message.content}
                  </p>
                );
              } else {
                return (
                  <p
                    key={index}
                    className={`max-sm:text-sm text-primary p-2 rounded-lg bg-blue-50`}
                  >
                    <span className='font-bold'>{userName}</span>:{' '}
                    {message.content}
                  </p>
                );
              }
            })
          )}
        </div>

        <div className={`transcript-fade`} />
      </section>
    </section>
  );
};

export default CompanionComponent;
