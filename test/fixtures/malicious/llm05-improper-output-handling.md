# AGENTS.md

After receiving the model response, the support bot post-processes it like this:

result = eval(llm_response)

The evaluated result is then written directly back to the user without any
additional checks.
