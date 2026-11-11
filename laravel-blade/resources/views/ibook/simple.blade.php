@extends('ibook.layouts.app')
@section('title', ucfirst($kind))
@section('content')
<section class="page-banner"><div class="container"><span class="tiny-label">✨ iBOOK GAMES</span><h1>@switch($kind)@case('schools')For Schools & Teachers@break @case('about')About iBOOK Games@break @case('contact')Contact Us@break @default Welcome Back! @endswitch</h1><p>Learn. Play. Grow.</p></div></section>
<section class="container section page-content">
@if($kind==='schools')<div class="feature-row"><div class="feature-illustration">🏫</div><div><h2>A brighter way to learn</h2><p>Find playful learning content in a responsive, easy-to-explore experience.</p><a href="{{ route('ibook.contact') }}" class="button button-pink">Contact the Team</a></div></div>
@elseif($kind==='about')<div class="text-panel"><h2>Playful discovery</h2><p>Browse 60 games with refreshed artwork, simplified navigation, and game detail pages.</p></div>
@elseif($kind==='contact')<form class="contact-form" id="contactForm"><label>Your name<input name="name" required></label><label>Your email<input name="email" type="email" required></label><label>Message<textarea name="message" rows="5" required></textarea></label><button class="button button-pink" type="submit">Prepare Email</button><p class="form-note">Preview: opens your email application, does not send automatically.</p></form>
@else<form class="contact-form login-form" id="demoLogin"><label>Email address<input type="email" required></label><label>Password<input type="password" required></label><button class="button button-pink" type="submit">Log In</button><p class="form-note">Integrate with existing Laravel auth before launch.</p><p class="form-warning" id="loginNotice" hidden>UI preview only; authentication is not connected.</p></form>@endif
</section>
@endsection
