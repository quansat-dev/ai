<script lang="ts">
	import sanitizeHtml from 'sanitize-html';

	import { resolve } from '$app/paths';
	import { ai } from '$lib/ai.remote';

	const sanitizeOptions: Parameters<typeof sanitizeHtml>[1] = {
		allowedClasses: {
			'*': ['text-ai'],
		},
	};
</script>

<main class="group max-w-pad flex-1">
	<div class="mx-auto max-w-3xl space-y-8">
		<h1 class="c-text-heading-lg">
			Hỏi <em class="text-ai">ai</em>, <em class="text-ai">ai</em> đáp
		</h1>
		<form
			class="flex max-w-2xl items-baseline"
			{...ai.enhance(async ({ submit }) => {
				try {
					await submit();
				} catch (e) {
					console.error(e);
				}
			})}
		>
			<label class="c-text-input flex-1">
				<span>Hỏi:</span>
				<input
					class="flex-1"
					placeholder="cái gì, tại sao, ở đâu, v.v."
					required
					{...ai.fields.prompt.as('text')}
				/>
			</label>
			<button class="c-btn min-w-20" type="submit">Đáp</button>
		</form>
		{#if ai.result}
			{@const { cadao, dap } = ai.result}
			<div class="output space-y-4">
				<p>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html sanitizeHtml(dap, sanitizeOptions)}
				</p>
				<hr />
				<blockquote class="w-fit space-y-4 px-8 pt-8">
					<p class="font-lora relative px-4 leading-relaxed">
						{@render quotes('absolute right-full -top-3')}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html sanitizeHtml(cadao, sanitizeOptions)}
						{@render quotes('absolute -scale-100 left-full -bottom-3')}
					</p>
					<p class="px-4">— Ca dao Việt Nam</p>
				</blockquote>
			</div>
		{/if}
	</div>
</main>
<footer class="max-w-pad tablet:py-6 desktop:py-8 py-4">
	<a class="about-link c-link-preserved mx-auto block w-fit" href={resolve('/ve-ai')}>
		Cái gì đây?
	</a>
</footer>

{#snippet quotes(cls: string)}
	<i class={['flex gap-0.5', cls]}>
		<span class="quote bg-on-surface shrink-0"></span>
		<span class="quote bg-placeholder shrink-0"></span>
	</i>
{/snippet}

<style lang="postcss">
	main {
		padding-top: 32vh;
		transition: padding-top 250ms var(--default-transition-timing-function);

		&:has(.output) {
			padding-top: 20vh;
		}
	}

	.about-link {
		pointer-events: none;
		opacity: 0;
		transition: opacity 250ms 5s var(--default-transition-timing-function);

		main:has(.output) ~ footer & {
			pointer-events: auto;
			opacity: 1;
		}
	}

	.quote {
		width: calc(var(--spacing) * 4);
		height: calc(var(--spacing) * 7.5);

		mask-image: url('$lib/assets/images/quote.svg');
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
	}
</style>
