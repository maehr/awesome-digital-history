<script>
</script>

<svelte:head>
	<title>Contributing to Awesome Digital History</title>
</svelte:head>

<main class="container mx-auto">
	<section class="prose">
			<h2 id="contribution-guidelines">Contribution Guidelines</h2>
			<p>Please note that this project is released with a <a
			href="https://github.com/maehr/awesome-digital-history/blob/main/CODE_OF_CONDUCT.md">Contributor Code of Conduct</a>. By
			participating in this project you agree to abide by its terms.</p>
			<hr />
			<h3 id="we-welcome">We welcome</h3>
			<ul>
			<li><strong>Additions</strong>: restricted to addition of one new entry
			per pull-request.</li>
			<li><strong>Removals</strong>: restricted to removal of one obsolete
			entry per pull-request.</li>
			<li><strong>Edits</strong>: you may correct the descriptions if it can
			be improved.</li>
			</ul>
			<hr />
			<p>If you are proficient with GitHub, follow the instructions below.
			Otherwise open an <a
			href="https://github.com/maehr/awesome-digital-history/issues/new/choose">issue</a>.</p>
			<hr />
			<h3 id="criteria-for-accepting-a-pull-request">Criteria for accepting a
			pull-request</h3>
			<p><em>Contributors, make sure that</em>:</p>
			<ul>
			<li>a <strong>short pitch</strong> is included in the pull-request
			description,</li>
			<li>the table of contents has been updated (if a section is added /
			removed),</li>
			<li>the contents are sorted <strong>alphabetically</strong>,</li>
			<li>The addition you proposed is NOT part of <a
			href="https://github.com/maehr/awesome-digital-history/wiki">everything
			that did not make it into the list</a>.</li>
			</ul>
			<p>Thank you for your suggestions!</p>
			<p><em>Maintainers, make sure that</em>:</p>
			<ul>
			<li>the above criteria are followed,</li>
			<li>the tests pass on the CI,</li>
			<li>in case of addition or removal, make an assessment of awesomeness of
			the entry.</li>
			</ul>
			<h3 id="updating-your-pr">Updating your PR</h3>
			<p>A lot of times, making a PR adhere to the standards above can be
			difficult. If the maintainers notice anything that we’d like changed,
			we’ll ask you to edit your PR before we merge it. There’s no need to
			open a new PR, just edit the existing one. If you’re not sure how to do
			that, <a
			href="https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md">here
			is a guide</a> on the different ways you can update your PR so that we
			can merge it.</p>
			<h3 id="appendix-running-lint-tests">Appendix: running lint tests</h3>
			<p>To run tests locally:</p>
			<pre><code># using ruby
			gem install awesome_bot
			awesome_bot README.md
			# using node.js
			npm install -g awesome-lint
			awesome-lint README.md</code></pre>
	</section>
</main>
