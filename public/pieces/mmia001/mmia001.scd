(
fork{
	s.options.numAudioBusChannels = 400;
	s.options.memSize = 81920;
	0.1.wait;

	//Initialization Sequence
	~init = {
		s.waitForBoot{
			fork{

				'Init Seq #1 - Groups, Load Buffers, Add SynthDefs'.postln;

				//Create Groups: 100-Sources; 101-Grains; 102-Effects1; 103-Effects2
				s.sendMsg(\g_new, 100, 1, 1);
				3.do{|ix| s.sendMsg(\g_new, 101+ix, 3, 100+ix)};

				//Load Buffers
				~samps = SoundFile.collectIntoBuffers("/Users/jwloy/Documents/GitHub/music_made_in_airports-001/public/pieces/mmia001/samples/" ++ "*");
				~samps.do{|it ix| it.postln};

				//Synth Defs
				SynthDef(\sineBeating001_aBus50, {
					arg outBus=50, sweepFreq=0.001, beatingSweepFreq=0.005, beatingFreqGap = 2, amp=0.7, freqRangeLow=90, freqRangeHigh=700;
					var sine1, sine2, signal, mainFreq, beatingIntervalCps;
					mainFreq = LFTri.ar(sweepFreq).range(freqRangeLow, freqRangeHigh);
					beatingIntervalCps = (mainFreq.cpsmidi-(mainFreq.cpsmidi-beatingFreqGap)).midicps;
					sine1 = SinOsc.ar(mainFreq);
					sine2 = SinOsc.ar(mainFreq+LFTri.ar(beatingSweepFreq).range((beatingIntervalCps*  -1), beatingIntervalCps));
					signal = Mix.ar([sine1, sine2]);
					Out.ar(outBus, [signal, signal]*amp);
				}).add;

				SynthDef(\singleGrain_in,{
					arg inBus=0, outBus=0, t_t1=0,  envbufnum, grainDur=0.5, amp=1;
					var grain, trig, in, freeNode;
					in = In.ar(inBus);
					trig = T2A.ar(t_t1);
					grain = GrainIn.ar(1, trig,grainDur, in, 0, envbufnum);
					freeNode = EnvGen.ar(Env.linen(0, 0, grainDur, 0),doneAction:2);
					Out.ar(outBus, grain*amp);
				}).add;

				SynthDef(\singleGrain_buf,{
					arg outBus=0, t_t1=0, envbuf, grainDur=0.5, sndbuf, rate=1, amp=1;
					var grain, trig, in, freeNode;
					trig = T2A.ar(t_t1);
					grain = BufGrainB.ar(trig,grainDur,sndbuf,1,PinkNoise.kr.range(0,1),envbuf);
					freeNode = EnvGen.ar(Env.linen(0, 0, grainDur, 0),doneAction:2);
					Out.ar(outBus, grain*amp);
				}).add;

				SynthDef(\greyhole,{
					arg inBus,outBus=0,delayTime=0.3,damp=0.25, size=1.0, diff=0.707, feedback=0.85, modDepth=0, modFreq=0;
					var in, sig;
					in = In.ar(inBus);
					sig = Greyhole.ar(in,delayTime,damp, size, diff, feedback, modDepth, modFreq);
					Out.ar(outBus,sig);
				}).add;

				SynthDef(\bitcrush, {
					arg inBus, outBus=0, amp=0.3, rate=44100, bit=8;
					var source, sig;
					source = In.ar(inBus,2);
					sig = Decimator.ar(source, rate, bit);
					Out.ar(outBus, sig*amp);
				}).add;

				SynthDef(\singleGrain_fm,{
					arg outBus=0, t_t1=0, envbufnum, grainDur=0.5, carfreq=440,modfreq=200,amp=0.6 ;
					var grain, trig, freeNode;
					trig = T2A.ar(t_t1);
					grain = GrainFM.ar(1,trig,grainDur,carfreq,modfreq,1,0,envbufnum);
					freeNode = EnvGen.ar(Env.linen(0, 0, grainDur, 0),doneAction:2);
					Out.ar(outBus, grain*amp);
				}).add;
				1.wait;

				'Init Sequence #2 - Start Synth Defs, Init OSCdefs'.postln;
				//Sources - persistant synths on nodes 50-99
				s.sendMsg(\s_new, \sineBeating001_aBus50, 50, 1, 100, \outBus, 50); //node 50, outBus 50
				//Greyhole01 -  delayTime between 0.03-0.07; size between 0.3-0.8
				s.sendMsg(\s_new, \greyhole, 200, 1, 103, \inBus, 200, \delayTime, 0.03 , \damp,0.0, \size, 0.7 , \diff, 0.01, \feedback,0.8, \modDepth,0, \modFreq,0);

				//Greyhole02
				s.sendMsg(\s_new, \greyhole, 201, 1, 103,\inBus, 202, \delayTime, 0.1 , \damp,0.5, \size, 0.2 , \diff, 0.2, \feedback,0.4, \modDepth,0, \modFreq,0, \outBus, 0);

				//Greyhole03
				s.sendMsg(\s_new, \greyhole, 202, 1, 103,\inBus, 204,\delayTime, 0.055 , \damp,0.1, \size, 0.4 , \diff, 0.031, \feedback,0.9, \modDepth,0, \modFreq,0, \outBus, 0); // delayTime 0.03-0.55
				//Bitcrush
				s.sendMsg(\s_new, \bitcrush, 203, 1, 102, \inBus, 206,\rate,5000,\bit,1, \outBus, 200);

				//OSC defs
				~oscInit = OSCdef( \init, {~init.value}, "/init" );
				~oscExit = OSCdef( \exit, {~exit.value}, "/exit" );
				0.1.wait;

				'Init Sequence #3 - Set Up Grains'.postln;

				~reverseChipsinc = 0;
				~reverseChipsFunc= {~reverseChipsinc = ~reverseChipsinc+1; s.sendMsg(\s_new, \singleGrain_buf, 6000+ ~reverseChipsinc, 1, 101, \outBus, 200, \t_t1,1,\envbuf, 2, \grainDur,0.65, \sndbuf, 12, \amp, 8)};
				~reverseChipsOSC = OSCdef( \reverseChips, {~reverseChipsFunc.value}, "/reverseChips" );

				~bloopinc = 0;
				~bloopFunc = {
~bloopDur = rrand(0.04, 0.5); ~bloopinc= ~bloopinc+1; s.sendMsg(\s_new, \singleGrain_in, 3000+ ~bloopinc, 1, 101, \outBus, 202, \inBus, 50, \t_t1,1,\envbufnum, 1, \grainDur, ~bloopDur, \amp, 0.75);
};
~bloopOSC = OSCdef( \bloop, {~bloopFunc.value}, "/bloop" );

				~beaminc = 0;
				~beamFunc = { ~beaminc = ~beaminc+1; ~carF = rrand(150, 780); ~modF = rrand(211, 821); ~genv1 = [1,2].choose; ~gdur1 = rrand(0.25, 1.33); s.sendMsg(\s_new, 'singleGrain_fm', 4000+ ~beaminc, 1, 101, 'outBus', 204, \t_t1,1,\envbufnum, ~genv1, \amp, 0.18, \grainDur, ~gdur1, \carfreq,~carF, \modfreq, ~modF);};
~beamOSC = OSCdef( \beam, {~beamFunc.value}, "/beam" );

				~swirlinc = 0;
				~swirlFunc = { ~swirlinc= ~swirlinc+1; ~gd2=rrand(0.25,0.75); s.sendMsg(\s_new, \singleGrain_buf, 5000+ ~swirlinc, 1, 101, \outBus, 200, \t_t1,1, \envbuf, 2, \grainDur,~gd2, \sndbuf, 23,  \amp, 2.5);};
~swirlOSC = OSCdef( \swirl, {~swirlFunc.value}, "/swirl" );

				~giantinc = 0;
~giantFunc = { ~giantinc= ~giantinc+1; s.sendMsg(\s_new, \singleGrain_buf, 7000+ ~giantinc, 1, 101, \outBus, 202, \t_t1,1, \envbuf, 1, \grainDur,1.3, \sndbuf, 24,  \amp, 2.5);};
~giantOSC = OSCdef( \giant, {~giantFunc.value}, "/giant" );

				~chimeinc = 0;
~chimeFunc = { ~chimeinc= ~chimeinc+1;s.sendMsg(\s_new, \singleGrain_buf, 8000+ ~chimeinc, 1, 101, \outBus, 204, \t_t1,1, \envbuf, 2, \grainDur, 1.7  , \sndbuf, 20 ,  \amp, 2.5);};
~chimeOSC = OSCdef( \chime, {~chimeFunc.value}, "/chime" );

				~crunchinc = 0;
~crunchFunc = { ~crunchinc = ~crunchinc+1; ~gdur6 = rrand(0.15, 0.6); s.sendMsg(\s_new, \singleGrain_buf, 9000+ ~crunchinc, 1, 101, \outBus, 206, \t_t1,1, \envbuf, 0, \grainDur,~gdur6, \sndbuf, 16,  \amp, 1);};
~crunchOSC = OSCdef( \crunch, {~crunchFunc.value}, "/crunch" );




				0.1.wait;

				//For processes you need to defer
				{

				}.defer

			}
	}};

	//Exit Sequence
	~exit = {
		fork{
			'Exit Sequence #1 - Kill all nodes 100 - 10100'.postln;
			10101.do{|ix| s.sendMsg(\n_free, ix)};
			0.5.wait;

			'Exit Sequence #2 - Release all Buffers'.postln;
			100.do{|ix| s.sendMsg(\b_free, ix)};
			0.5.wait;

			'Exit Sequence #3 - Free all Groups'.postln;
			5.do{|ix| s.sendMsg(\g_deepFree, ix+100)};
			0.5.wait;

			'Exit Sequence #4 - Free Synthesis Server'.postln;
			s.sendMsg(\quit);
			0.1.wait;
	}};
	0.1.wait;

	~init.value;
}
)


/*
matter.js triggers from example
make piece
make panners
*/

//Remote init and exit
a = NetAddr("localhost", 57120);
a.sendMsg("/init");
a.sendMsg("/exit");
a.sendMsg("/reverseChips");
a.sendMsg("/bloop");
a.sendMsg("/beam");
a.sendMsg("/swirl");
a.sendMsg("/giant");
a.sendMsg("/chime");
a.sendMsg("/crunch");



