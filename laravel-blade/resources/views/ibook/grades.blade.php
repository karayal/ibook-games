@extends('ibook.layouts.app')
@section('title', 'Grades')
@section('content')
<section class="page-banner"><div class="container"><span class="tiny-label">🎓 EVERY LEARNER, EVERY LEVEL</span><h1>Games by Grade</h1><p>Easy discovery for classrooms, parents, and learners.</p></div></section><section class="container section"><div class="section-head"><div><h2>🎓 Choose a Grade</h2><p>Grade-to-game mappings must sync with your original records.</p></div></div><div class="grades-page-grid">@for($i=1;$i<=12;$i++)<button type="button" class="grade-big grade-tone-{{ $i%6 }}" data-grade="{{ $i }}"><span>🎒</span><strong>Grade {{ $i }}</strong><small>Select grade</small></button>@endfor</div><div class="grade-notice" id="gradeNotice"><strong>Curriculum mapping pending</strong><p>We have preserved the full Grade 1–12 structure without inventing individual game assignments.</p><a href="{{ route('ibook.games.index') }}" class="button button-pink">Browse all 60 games</a></div></section>
@endsection
